import type { Metadata } from "next";

import { Contact } from "@/components/sections/contact";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Contact
      eyebrow="Contact"
      title="Let's talk about your project"
      description="Tell us what you're building and we'll get back to you within one business day."
    />
  );
}
