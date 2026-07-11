import type { UserRole } from "@/types/database";

/**
 * Role logic shared by server and client code.
 * (lib/auth.ts is server-only — it imports next/headers via the Supabase
 * server client — so anything a client component needs lives here.)
 */

export const ROLE_WEIGHT: Record<UserRole, number> = { user: 0, editor: 1, admin: 2 };

/** True if `role` meets or exceeds `min`. */
export function roleAtLeast(role: UserRole, min: UserRole): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[min];
}
