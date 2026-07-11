import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  path: "/terms",
});

/**
 * TEMPLATE — review with the client (and their counsel where appropriate)
 * before launch. Placeholders are marked [EDIT].
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="[EDIT: date]">
      <h2>Agreement</h2>
      <p>
        By using {siteConfig.url}, you agree to these terms. If you don’t agree, please don’t use
        the site.
      </p>

      <h2>Use of the site</h2>
      <p>
        Content on this site is provided for general information about {siteConfig.name} and its
        services. You may not misuse the site, attempt to access it by unauthorized means, or use it
        to transmit anything unlawful.
      </p>

      <h2>Accounts</h2>
      <p>
        If you create an account, you’re responsible for keeping your credentials secure and for
        activity under your account.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site’s content, design, and branding belong to {siteConfig.name} or its licensors and
        may not be reproduced without permission.
      </p>

      <h2>Disclaimer & liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent
        permitted by law, {siteConfig.name} is not liable for indirect or consequential damages
        arising from use of the site. [EDIT: adjust to your jurisdiction.]
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: [EDIT: email].</p>
    </LegalPage>
  );
}
