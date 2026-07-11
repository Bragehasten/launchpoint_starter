import "server-only";

import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client — BYPASSES RLS.
 *
 * Use only where no user session exists AND the data source is already
 * trusted (signature-verified Stripe webhooks). Never import from anything
 * reachable by user input paths. Returns null until the key is configured.
 */
export function createAdminClient(): SupabaseClient<Database> | null {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
