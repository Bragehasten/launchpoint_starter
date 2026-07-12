import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DynamicForm } from "@/components/forms/dynamic-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { enabledForms, getFormDef } from "@/config/forms";
import { resolveFormDef, toClientDef } from "@/lib/forms/types";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

/**
 * Generic form route: every enabled form gets a page for free.
 * /forms/contact, /forms/employment, /forms/catering, ...
 * Disabled forms 404 — same self-guarding pattern as capabilities.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseDef = getFormDef(slug);
  if (!baseDef) return {};
  const def = resolveFormDef(baseDef, await getLocale());
  return createMetadata({ title: def.title, path: `/forms/${slug}` });
}

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseDef = getFormDef(slug);
  if (!baseDef) notFound();
  const def = resolveFormDef(baseDef, await getLocale());

  return (
    <Section>
      <Container className="flex max-w-2xl flex-col gap-10">
        <SectionHeading title={def.title} description={def.intro} />
        <DynamicForm def={toClientDef(def)} />
      </Container>
    </Section>
  );
}

export function generateStaticParams() {
  return enabledForms.map((slug) => ({ slug }));
}
