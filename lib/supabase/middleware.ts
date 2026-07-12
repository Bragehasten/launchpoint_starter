import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Refreshes the auth session on every matched request and returns both the
 * response (with refreshed cookies) and the current user for route guards.
 *
 * IMPORTANT: do not run logic between createServerClient and auth.getUser() —
 * doing so can cause sessions to be randomly terminated.
 */
export async function updateSession(
  request: NextRequest,
  requestHeaders?: Headers,
  /** Internal rewrite target (i18n: /es/menu renders /menu). */
  rewriteTo?: URL,
): Promise<{ response: NextResponse; user: User | null }> {
  // Headers forwarded to the render. Mutating request.headers directly is NOT
  // honored by NextResponse.next — the override must be an explicit Headers
  // object passed as `request.headers`. This is also how the CSP nonce reaches
  // Next.js so it can stamp its framework scripts.
  const headers = requestHeaders ?? new Headers(request.headers);

  const buildResponse = () =>
    rewriteTo
      ? NextResponse.rewrite(rewriteTo, { request: { headers } })
      : NextResponse.next({ request: { headers } });

  let response = buildResponse();

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Reflect the refreshed cookies into the forwarded request headers so
          // this same render sees the new session.
          headers.set(
            "cookie",
            request.cookies
              .getAll()
              .map(({ name, value }) => `${name}=${value}`)
              .join("; "),
          );
          response = buildResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
