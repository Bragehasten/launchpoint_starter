import type { NextConfig } from "next";

import { redirects } from "./config/redirects";

/**
 * Static security headers applied to every route.
 * The Content-Security-Policy lives in middleware.ts (lib/security/csp.ts):
 * it needs a per-request nonce, which static headers can't provide.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage (media library uploads)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    serverActions: {
      // Media uploads go through a server action.
      bodySizeLimit: "8mb",
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
