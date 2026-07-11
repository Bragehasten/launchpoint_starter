import { CookieConsent } from "@/components/shared/cookie-consent";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { siteConfig } from "@/config/site";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

/** Public site chrome: header, footer, main landmark, Organization schema. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <JsonLd data={organizationJsonLd()} />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {siteConfig.features.cookieBanner ? <CookieConsent /> : null}
    </div>
  );
}
