import { EmailShell, EmailText } from "@/emails/components";
import { siteConfig } from "@/config/site";

/** Sent to a new newsletter subscriber. */
export function NewsletterWelcomeEmail() {
  return (
    <EmailShell preview={`Welcome to the ${siteConfig.name} newsletter`} heading="You're in!">
      <EmailText>
        Thanks for subscribing to the {siteConfig.name} newsletter. You&apos;ll get occasional
        updates — no spam, unsubscribe anytime by replying to any email.
      </EmailText>
    </EmailShell>
  );
}
