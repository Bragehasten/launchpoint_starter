import { NextResponse, type NextRequest } from "next/server";

import { enabledForms } from "@/config/forms";
import { enabledLocales } from "@/lib/i18n/config";
import { CAPABILITY_PATHS, isCapabilityEnabled } from "@/lib/capabilities";
import type { CapabilityKey } from "@/lib/capabilities/types";
import { env } from "@/lib/env";
import { buildCsp, generateNonce } from "@/lib/security/csp";
import { updateSession } from "@/lib/supabase/middleware";

/** Route prefixes that require an authenticated user. */
const PROTECTED_PREFIXES = ["/admin", "/account"];

/** Auth pages a signed-in user shouldn't see again. */
const AUTH_PAGES = ["/sign-in", "/sign-up", "/reset-password"];

export async function middleware(request: NextRequest) {
  // Strict nonce CSP (production only — Turbopack dev needs eval/inline).
  // Next.js discovers the nonce by parsing the Content-Security-Policy request
  // header, so it must be forwarded to the render as an explicit Headers
  // override (via updateSession) as well as set on the response the browser
  // enforces. The app is forced dynamic (app/layout.tsx) so every page renders
  // per-request and receives a nonce — static pages could not carry one.
  const nonce = process.env.NODE_ENV === "production" ? generateNonce() : null;
  const csp = nonce ? buildCsp(nonce) : null;

  const requestHeaders = new Headers(request.headers);
  if (nonce && csp) {
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("content-security-policy", csp);
  }

  // i18n: /es/<path> renders <path> with x-locale=es (per-client opt-in via
  // siteConfig.locales). Locale-by-header needs no route moves because the
  // app already renders per-request. All checks below use the STRIPPED path.
  let pathname = request.nextUrl.pathname;
  let localePrefix = "";
  if (enabledLocales().includes("es") && (pathname === "/es" || pathname.startsWith("/es/"))) {
    localePrefix = "/es";
    pathname = pathname.replace(/^\/es(?=\/|$)/, "") || "/";
    requestHeaders.set("x-locale", "es");
  } else {
    requestHeaders.set("x-locale", "en");
  }
  const rewriteTo = localePrefix
    ? new URL(pathname + request.nextUrl.search, request.url)
    : undefined;

  // Routing-layer 404s for disabled features. Their pages already call
  // notFound(), but under the app's per-request dynamic rendering (required for
  // the CSP nonce; see app/layout.tsx) a streamed notFound() can't set a 404
  // status. Rewriting to an unmatched path renders the styled not-found page
  // with a real 404.
  const notFoundResponse = () => {
    const res = NextResponse.rewrite(new URL("/_not-found", request.url), {
      request: { headers: requestHeaders },
    });
    if (csp) res.headers.set("Content-Security-Policy", csp);
    return res;
  };

  // Disabled/unknown engine forms.
  const formMatch = pathname.match(/^\/forms\/([^/]+)\/?$/);
  if (formMatch && !enabledForms.includes(formMatch[1]!)) return notFoundResponse();

  // Disabled capabilities (their route + any sub-routes, e.g. /service-areas
  // and /service-areas/[slug]) vanish for modules that don't enable them.
  for (const key of Object.keys(CAPABILITY_PATHS) as CapabilityKey[]) {
    const path = CAPABILITY_PATHS[key];
    if ((pathname === path || pathname.startsWith(`${path}/`)) && !isCapabilityEnabled(key)) {
      return notFoundResponse();
    }
  }

  // A single location IS the /locations page — redirect to it. The page does
  // this too, but under dynamic rendering redirect() degrades to a client-side
  // hop (HTTP 200), which undercuts this SEO feature; do it as a real redirect
  // at the routing layer.
  if (pathname === "/locations" && isCapabilityEnabled("locations")) {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/locations?select=slug&limit=2`,
        {
          headers: {
            apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        },
      );
      const rows = res.ok ? ((await res.json()) as { slug: string }[]) : [];
      if (rows.length === 1 && rows[0]) {
        const url = request.nextUrl.clone();
        url.pathname = `${localePrefix}/locations/${rows[0].slug}`;
        return NextResponse.redirect(url);
      }
    } catch {
      // Network hiccup — fall through; the page still handles it client-side.
    }
  }

  const { response, user } = await updateSession(request, requestHeaders, rewriteTo);

  if (!user && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PAGES.some((page) => pathname === page)) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (csp) response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Run on everything except static assets and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
