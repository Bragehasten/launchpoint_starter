"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin server actions. Guarded twice: requireRole() for UX, RLS for truth.
 */

const updateRoleSchema = z.object({
  userId: z.uuid(),
  role: z.enum(["admin", "editor", "user"]),
});

export async function updateUserRole(formData: FormData): Promise<void> {
  const admin = await requireRole("admin");

  const parsed = updateRoleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  // Guardrail: an admin cannot demote themselves. Prevents locking the last
  // admin out of the dashboard; another admin must do it.
  if (parsed.data.userId === admin.id && parsed.data.role !== "admin") return;

  const supabase = await createClient();
  await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.userId);

  revalidatePath("/admin/users");
}
