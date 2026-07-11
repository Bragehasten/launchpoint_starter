import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  path: "/cookies",
});

/**
 * TEMPLATE — keep in sync with what the site actually sets. Placeholders
 * are marked [EDIT].
 */
export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="[EDIT: date]">
      <h2>What cookies we use</h2>
      <p>
        {siteConfig.name} uses a small number of cookies and similar technologies. You can manage
        non-essential cookies through the consent banner.
      </p>

      <h2>Essential</h2>
      <p>
        Required for the site to function: authentication session cookies (only if you sign in) and
        your cookie-consent choice itself. These cannot be switched off.
      </p>

      <h2>Analytics</h2>
      <p>
        With your consent, we use privacy-respecting analytics to understand site usage. These
        measure page views and performance without building advertising profiles. [EDIT: name the
        analytics provider once enabled.]
      </p>

      <h2>Managing preferences</h2>
      <p>
        You can change your choice anytime by clearing this site’s data in your browser, which will
        re-show the consent banner on your next visit.
      </p>
    </LegalPage>
  );
}
