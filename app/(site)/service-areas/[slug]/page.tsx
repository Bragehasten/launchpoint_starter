import type { Metadata } from "next";
import { LocalLink as Link } from "@/components/shared/local-link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { Faq } from "@/components/sections/faq";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { clientConfig } from "@/config/client";
import { getFormDef } from "@/config/forms";
import { siteConfig } from "@/config/site";
import { getCapability, isCapabilityEnabled } from "@/lib/capabilities";
import {
  getServiceAreaBySlug,
  getServiceAreas,
  getServiceGroups,
} from "@/lib/capabilities/queries";
import { resolveFormDef, toClientDef } from "@/lib/forms/types";
import { getDict, interpolate } from "@/lib/i18n";
import { createMetadata, faqJsonLd, JsonLd, serviceAreaJsonLd } from "@/lib/seo";
import type { Json } from "@/types/json";

/**
 * Service-area landing page: "Roofing in Jupiter, FL". Unique copy per
 * area (enforced editorially — see docs/service-areas.md), services
 * offered, area FAQs with FAQPage JSON-LD, a quote form, and an
 * internal-link mesh to every other area.
 */

type FaqEntry = { question: string; answer: string };

function parseFaqs(faqs: Json): FaqEntry[] {
  if (!Array.isArray(faqs)) return [];
  return faqs.filter(
    (entry): entry is FaqEntry =>
      typeof entry === "object" &&
      entry !== null &&
      !Array.isArray(entry) &&
      typeof entry.question === "string" &&
      typeof entry.answer === "string",
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const capability = getCapability("serviceAreas");
  if (!capability.enabled) return {};
  const { slug } = await params;
  const area = await getServiceAreaBySlug(slug);
  if (!area) return {};
  const { locale, dict } = await getDict();
  const noun =
    (locale === "es" ? capability.serviceNounEs : undefined) ??
    capability.serviceNoun ??
    clientConfig.module.label;
  const localizedName = `${area.name}${area.region ? `, ${area.region}` : ""}`;
  return createMetadata({
    title: interpolate(dict.serviceAreas.inArea, { noun, area: localizedName }),
    description: area.intro,
    path: `/service-areas/${slug}`,
  });
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapability("serviceAreas");
  if (!capability.enabled) notFound();

  const { slug } = await params;
  const area = await getServiceAreaBySlug(slug);
  if (!area) notFound();

  const { locale, dict } = await getDict();
  const noun =
    (locale === "es" ? capability.serviceNounEs : undefined) ??
    capability.serviceNoun ??
    clientConfig.module.label;
  const [allAreas, serviceGroups] = await Promise.all([
    getServiceAreas(),
    isCapabilityEnabled("services") ? getServiceGroups() : Promise.resolve([]),
  ]);
  const otherAreas = allAreas.filter((a) => a.id !== area.id);
  const faqs = parseFaqs(area.faqs);
  const quoteDef = getFormDef("quote");
  const services = serviceGroups.flatMap((group) => group.services);

  return (
    <>
      <JsonLd
        data={serviceAreaJsonLd({
          serviceNoun: noun,
          businessType: clientConfig.module.businessType,
          areaName: area.name,
          region: area.region,
          url: `${siteConfig.url}/service-areas/${area.slug}`,
        })}
      />
      {faqs.length > 0 ? <JsonLd data={faqJsonLd(faqs)} /> : null}

      <Section>
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Link
              href="/service-areas"
              className="text-muted-foreground inline-flex w-fit items-center gap-1.5 text-sm hover:underline"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {dict.serviceAreas.allAreas}
            </Link>
            <h1 className="heading text-3xl text-balance sm:text-5xl">
              {interpolate(dict.serviceAreas.inArea, {
                noun,
                area: `${area.name}${area.region ? `, ${area.region}` : ""}`,
              })}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">{area.intro}</p>
          </div>

          {area.body ? (
            <div className="max-w-prose text-base leading-relaxed whitespace-pre-line">
              {area.body}
            </div>
          ) : null}

          {services.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="heading text-2xl">
                {interpolate(dict.serviceAreas.whatWeDo, { area: area.name })}
              </h2>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <li key={service.id} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary size-4 shrink-0" aria-hidden="true" />
                    {service.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      {faqs.length > 0 ? (
        <Faq
          heading={{
            title: interpolate(dict.serviceAreas.questions, { area: area.name }),
            align: "left",
          }}
          items={faqs}
        />
      ) : null}

      {quoteDef ? (
        <Section>
          <Container className="flex max-w-2xl flex-col gap-8">
            <SectionHeading
              title={interpolate(dict.serviceAreas.freeQuote, { area: area.name })}
              description={dict.serviceAreas.freeQuoteBody}
              align="left"
            />
            <DynamicForm def={toClientDef(resolveFormDef(quoteDef, locale))} />
          </Container>
        </Section>
      ) : null}

      {otherAreas.length > 0 ? (
        <Section className="pt-0">
          <Container className="flex flex-col gap-4">
            <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              {dict.serviceAreas.alsoServing}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {otherAreas.map((other) => (
                <li key={other.id}>
                  <Link href={`/service-areas/${other.slug}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/70">
                      {other.name}
                      {other.region ? `, ${other.region}` : ""}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
