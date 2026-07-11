import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { Analytics } from "@/components/shared/analytics";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { activeThemeName } from "@/config/theme";
import { env } from "@/lib/env";
import { fontMono, fontSans } from "@/lib/fonts";

import "./globals.css";

/**
 * Root layout: document shell + providers only.
 * Route groups own their chrome: (site) renders the marketing header/footer,
 * admin/ renders the dashboard shell.
 */

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Opt every route into per-request (dynamic) rendering so the strict CSP's
  // per-request nonce (lib/security/csp.ts) is stamped onto each page's
  // scripts — a statically prerendered page freezes its <script> tags at build
  // time and `strict-dynamic` would then block all of its JS. Reading headers()
  // (rather than `export const dynamic = "force-dynamic"`) avoids eager
  // streaming, so programmatic notFound() still returns a real 404 status.
  await headers();

  return (
    <html lang="en" data-theme={activeThemeName} suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
        <ThemeProvider>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
