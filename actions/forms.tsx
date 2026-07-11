"use server";

import { headers } from "next/headers";

import { NewsletterWelcomeEmail } from "@/emails/newsletter-welcome";
import { sendEmail } from "@/lib/email/send";
import { createLogger } from "@/lib/log";

const log = createLogger("forms");
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validations/forms";

/**
 * Newsletter signup (footer widget) — a single-field special case.
 * All other public forms are the engine: actions/form-engine.tsx.
 * Shared defense in depth:
 * 1. honeypot field (schema rejects non-empty values)
 * 2. per-IP rate limiting
 * 3. Zod validation (client validates too, but the server is the truth)
 * 4. RLS: anonymous sessions can only INSERT, never read
 */

export type FormActionResult = { success: boolean; message?: string };

async function limitByIp(action: string, limit = 5): Promise<FormActionResult | null> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await rateLimit(`form:${action}:${ip}`, { limit, windowMs: 60_000 });
  return success
    ? null
    : { success: false, message: "Too many attempts — please wait a minute and try again." };
}

export async function subscribeNewsletter(input: unknown): Promise<FormActionResult> {
  const limited = await limitByIp("newsletter");
  if (limited) return limited;

  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const email = parsed.data.email.toLowerCase();

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    // Unique violation = already subscribed. Treat as success — never reveal
    // whether an email exists in the list.
    if (!error.message.includes("duplicate key")) {
      log.error("newsletter insert failed", { error: error.message });
      return { success: false, message: "Something went wrong — please try again." };
    }
    return { success: true, message: "You're subscribed!" };
  }

  await sendEmail({
    to: email,
    subject: "Welcome aboard!",
    react: <NewsletterWelcomeEmail />,
  });

  return { success: true, message: "You're subscribed — check your inbox!" };
}
