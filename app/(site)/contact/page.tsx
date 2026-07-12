import type { Metadata } from "next";

import { Contact } from "@/components/sections/contact";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
  path: "/contact",
});

const en = {
  eyebrow: "Contact",
  title: "Let's talk about your project",
  description: "Tell us what you're building and we'll get back to you within one business day.",
};

const es: typeof en = {
  eyebrow: "Contacto",
  title: "Hablemos de tu proyecto",
  description: "Cuéntanos qué estás construyendo y te responderemos en un día hábil.",
};

const content = { en, es };

export default async function ContactPage() {
  const t = content[await getLocale()];
  return <Contact eyebrow={t.eyebrow} title={t.title} description={t.description} />;
}
