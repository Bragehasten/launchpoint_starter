import { cache } from "react";
import { redirect } from "next/navigation";

import { roleAtLeast } from "@/lib/auth-shared";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/**
 * Auth helpers for Server Components and Server Actions.
 * Pure role logic lives in lib/auth-shared.ts (safe for client components).
 *
 * `getCurrentUser`/`getCurrentProfile` are wrapped in React cache() so
 * multiple calls within one request hit Supabase only once.
 */

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
});

/** Redirects to sign-in unless a user is authenticated. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

/**
 * Redirects unless the current user has at least the given role.
 * Note: this is a UX guard. Real enforcement is RLS in the database.
 */
export async function requireRole(role: UserRole) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/sign-in");
  if (!roleAtLeast(profile.role, role)) redirect("/");
  return profile;
}

export { roleAtLeast } from "@/lib/auth-shared";
