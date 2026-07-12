import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DynamicForm } from "@/components/forms/dynamic-form";
import { formRegistry } from "@/config/forms";
import { resolveFormDef, toClientDef } from "@/lib/forms/types";
import { getLocale } from "@/lib/i18n";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { getCapability } from "@/lib/capabilities";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("quotes");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Get a Quote", path: "/quote" });
}

/**
 * Quote-request capability: the trades workhorse (electricians → home
 * builders). Submissions land in the admin Inbox under kind "quote".
 */
export default async function QuotePage() {
  const capability = getCapability("quotes");
  if (!capability.enabled) notFound();

  return (
    <Section>
      <Container className="flex max-w-2xl flex-col gap-10">
        <SectionHeading
          eyebrow={capability.label ?? "Quote"}
          title={capability.label ?? "Request a quote"}
          description={
            capability.intro ??
            "Tell us about your project — we'll respond within one business day."
          }
          align="left"
        />
        <FadeIn>
          <DynamicForm def={toClientDef(resolveFormDef(formRegistry.quote!, await getLocale()))} />
        </FadeIn>
      </Container>
    </Section>
  );
}
