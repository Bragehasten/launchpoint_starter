"use server";

import { headers } from "next/headers";

import { getFormDef } from "@/config/forms";
import { FormAutoresponseEmail } from "@/emails/form-autoresponse";
import { FormSubmissionEmail } from "@/emails/form-submission";
import { sendEmail } from "@/lib/email/send";
import { env } from "@/lib/env";
import { buildFormSchema } from "@/lib/forms/schema";
import { isFileField } from "@/lib/forms/types";
import { createLogger } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const log = createLogger("form-engine");

/**
 * ONE server action for every engine form. Defense in depth, same as the
 * bespoke forms it replaces: honeypot (in schema) → per-IP rate limit →
 * Zod validation → insert-only RLS. Files are validated here (size/MIME)
 * and land in the private form-attachments bucket; submissions store the
 * storage path, never a URL.
 */

export type FormActionResult = { success: boolean; message?: string };

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function submitEngineForm(formData: FormData): Promise<FormActionResult> {
  const slug = String(formData.get("_form") ?? "");
  const def = getFormDef(slug);
  if (!def) return { success: false, message: "This form is not available." };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // Emergencies get a little more headroom — a panicking customer retries.
  const { success: withinLimit } = await rateLimit(`form:${slug}:${ip}`, {
    limit: def.emergency ? 8 : 5,
    windowMs: 60_000,
  });
  if (!withinLimit) {
    return { success: false, message: "Too many attempts — please wait a minute and try again." };
  }

  // Text values only; files handled separately below.
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key !== "_form") values[key] = value;
  }

  const parsed = buildFormSchema(def).safeParse({ company: "", ...values });
  if (!parsed.success) {
    // Honeypot hits land here too — reply generically, don't tip off bots.
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  const email = parsed.data.email;
  if (!email) return { success: false, message: "Email is required." };
  const supabase = await createClient();
  const data: Record<string, string | null> = {};
  for (const field of def.fields) {
    if (field.name === "email" || isFileField(field)) continue;
    data[field.name] = parsed.data[field.name] || null;
  }

  // Attachments: validate + upload to the private bucket, store the path.
  for (const field of def.fields) {
    if (!isFileField(field)) continue;
    const file = formData.get(field.name);
    if (!(file instanceof File) || file.size === 0) {
      if (field.required !== false) {
        return { success: false, message: `${field.label} is required.` };
      }
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      return { success: false, message: `${field.label}: file is larger than 5 MB.` };
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return { success: false, message: `${field.label}: use PDF, Word, or an image.` };
    }
    const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-80);
    const path = `${slug}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("form-attachments")
      .upload(path, file, { contentType: file.type });
    if (uploadError) {
      log.error("attachment upload failed", { slug, error: uploadError.message });
      return { success: false, message: "File upload failed — please try again." };
    }
    data[`${field.name}_attachment`] = path;
  }

  const { error } = await supabase.from("form_submissions").insert({ kind: slug, email, data });
  if (error) {
    log.error("insert failed", { slug, error: error.message });
    return { success: false, message: "Something went wrong — please try again." };
  }

  // Owner notification. Emergency forms take the loud path: URGENT subject.
  // SMS seam (backlog #24): trigger a Twilio/etc. send HERE for def.emergency.
  if (env.CONTACT_EMAIL) {
    const subject = def.subject?.(parsed.data) ?? `New ${def.title} submission`;
    const rows = def.fields
      .filter((f) => !isFileField(f))
      .map((f) => ({ label: f.label, value: parsed.data[f.name] ?? "—" }));
    const attachments = Object.keys(data).filter((k) => k.endsWith("_attachment"));
    if (attachments.length > 0) {
      rows.push({
        label: "Attachments",
        value: `${attachments.length} file(s) in the admin inbox`,
      });
    }
    await sendEmail({
      to: env.CONTACT_EMAIL,
      subject: def.emergency ? `🚨 URGENT — ${subject}` : subject,
      replyTo: email,
      react: <FormSubmissionEmail formTitle={def.title} rows={rows} />,
    });
  }

  if (def.autoresponder) {
    await sendEmail({
      to: email,
      subject: def.autoresponder.subject,
      react: (
        <FormAutoresponseEmail heading={def.autoresponder.subject} body={def.autoresponder.body} />
      ),
    });
  }

  return { success: true, message: def.successMessage };
}
