import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  noIndex: false,
});

/**
 * TEMPLATE — review with the client (and their counsel where appropriate)
 * before launch. Placeholders are marked [EDIT].
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="[EDIT: date]">
      <h2>Who we are</h2>
      <p>
        {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates {siteConfig.url}. This
        policy explains what personal information we collect and how we use it. Questions? Contact
        us at [EDIT: email].
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Information you give us.</strong> When you submit a contact form, subscribe to our
        newsletter, or create an account, we collect the details you provide — typically your name,
        email address, and message.
      </p>
      <p>
        <strong>Information collected automatically.</strong> We use privacy-respecting analytics to
        understand how the site is used (pages visited, approximate location, device type). See our{" "}
        <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>How we use it</h2>
      <p>
        To respond to your inquiries, provide services you request, send newsletters you opted into
        (unsubscribe anytime), and improve the site. We do not sell your personal information.
      </p>

      <h2>Where it’s stored</h2>
      <p>
        Data is stored with our infrastructure providers (Supabase for the database, Vercel for
        hosting, Resend for email). Each is bound by its own security and privacy commitments.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data or ask us to delete it at any time by contacting [EDIT:
        email]. Depending on where you live, you may have additional rights (GDPR, CCPA).
      </p>

      <h2>Changes</h2>
      <p>We’ll update this page when our practices change and revise the date above.</p>
    </LegalPage>
  );
}
