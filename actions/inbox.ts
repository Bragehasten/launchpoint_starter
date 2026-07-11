"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** Admin inbox actions (form submissions + subscribers). */

export async function toggleSubmissionRead(formData: FormData): Promise<void> {
  await requireRole("editor");
  const id = formData.get("id");
  const read = formData.get("read") === "true";
  if (typeof id !== "string") return;

  const supabase = await createClient();
  await supabase.from("form_submissions").update({ read }).eq("id", id);
  revalidatePath("/admin/inbox");
}

export async function deleteSubmission(formData: FormData): Promise<void> {
  await requireRole("editor");
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createClient();
  await supabase.from("form_submissions").delete().eq("id", id);
  revalidatePath("/admin/inbox");
}
