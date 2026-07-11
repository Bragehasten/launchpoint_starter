import { getCapability } from "@/lib/capabilities";

/**
 * Strict Content-Security-Policy with per-request nonces.
 *
 * Applied by middleware in production only: Turbopack dev relies on eval
 * and inline injection, so a dev CSP would either break HMR or be so loose
 * it verifies nothing. Static security headers stay in next.config.ts.
 *
 * How the nonce flows: middleware generates one per request, sets it on the
 * Content-Security-Policy *request* header (forwarded to the render via
 * updateSession), and Next.js stamps that nonce onto every framework script.
 * `strict-dynamic` then propagates trust to scripts those scripts create
 * (which is how the consent-gated analytics loader works without a host
 * allowlist). The 'unsafe-inline' + https: entries are fallbacks for old
 * browsers that don't understand nonces/strict-dynamic; modern browsers
 * ignore them.
 *
 * IMPORTANT: a per-request nonce requires per-request rendering — the app is
 * forced dynamic (see `export const dynamic` in app/layout.tsx). Statically
 * prerendered pages freeze their <script> tags at build time and could never
 * carry the nonce, so `strict-dynamic` would block all of their JS.
 */

/** External origins the app talks to, by directive. */
const SUPABASE = "https://*.supabase.co";
const SUPABASE_WS = "wss://*.supabase.co";
const VERCEL_VITALS = "https://vitals.vercel-insights.com";

/** Origin of the external booking embed, when a client uses one. */
function bookingEmbedOrigin(): string | null {
  const booking = getCapability("booking");
  if (!booking.enabled || !("externalEmbedUrl" in booking) || !booking.externalEmbedUrl) {
    return null;
  }
  try {
    return new URL(booking.externalEmbedUrl).origin;
  } catch {
    return null;
  }
}

/** Google Maps embeds on location landing pages (M17). */
const GOOGLE_MAPS_EMBED = "https://www.google.com";

export function buildCsp(nonce: string): string {
  const frameSrc = ["'self'", GOOGLE_MAPS_EMBED, bookingEmbedOrigin()].filter(Boolean).join(" ");

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https:`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: ${SUPABASE}`,
    `font-src 'self'`,
    `connect-src 'self' ${SUPABASE} ${SUPABASE_WS} ${VERCEL_VITALS}`,
    `frame-src ${frameSrc}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join("; ");
}

/** Web-crypto nonce, safe in the edge runtime. */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}
