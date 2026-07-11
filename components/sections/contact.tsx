import { Mail, MapPin, Phone } from "lucide-react";

import { DynamicForm } from "@/components/forms/dynamic-form";
import { formRegistry } from "@/config/forms";
import { toClientDef } from "@/lib/forms/types";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";

export type ContactProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional contact details shown beside the form. */
  details?: {
    email?: string;
    phone?: string;
    address?: string;
  };
};

/** Contact section: details column + the contact form. */
export function Contact({ eyebrow, title, description, details }: ContactProps) {
  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <FadeIn className="flex flex-col gap-4">
          {eyebrow ? (
            <p className="text-primary text-sm font-medium tracking-wide uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="heading text-3xl text-balance sm:text-4xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-lg text-balance">{description}</p>
          ) : null}
          {details ? (
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {details.email ? (
                <li className="flex items-center gap-2.5">
                  <Mail className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${details.email}`} className="hover:underline">
                    {details.email}
                  </a>
                </li>
              ) : null}
              {details.phone ? (
                <li className="flex items-center gap-2.5">
                  <Phone className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${details.phone.replace(/[^+\d]/g, "")}`}
                    className="hover:underline"
                  >
                    {details.phone}
                  </a>
                </li>
              ) : null}
              {details.address ? (
                <li className="flex items-center gap-2.5">
                  <MapPin className="text-primary size-4 shrink-0" aria-hidden="true" />
                  {details.address}
                </li>
              ) : null}
            </ul>
          ) : null}
        </FadeIn>
        <FadeIn delay={0.1}>
          <DynamicForm def={toClientDef(formRegistry.contact!)} />
        </FadeIn>
      </Container>
    </Section>
  );
}
