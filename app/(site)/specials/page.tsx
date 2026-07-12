import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Cta } from "@/components/sections";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCapability } from "@/lib/capabilities";
import { getPromotions } from "@/lib/capabilities/queries";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

const en = {
  title: "Current Specials",
  empty: "Nothing running right now — check back soon.",
  ends: "Ends",
  cta: "Questions?",
  contact: "Contact us",
};

const es: typeof en = {
  title: "Especiales actuales",
  empty: "Nada en curso por ahora, vuelve pronto.",
  ends: "Termina",
  cta: "¿Preguntas?",
  contact: "Contáctanos",
};

const pageContent = { en, es };

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("promotions");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Specials", path: "/specials" });
}

/**
 * Promotions capability: specials, seasonal offers, events, financing
 * banners — anything time-boxed. RLS hides expired/inactive rows.
 */
export default async function SpecialsPage() {
  const capability = getCapability("promotions");
  if (!capability.enabled) notFound();

  const promotions = await getPromotions();

  const locale = await getLocale();
  const t = pageContent[locale];

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={locale === "es" ? undefined : capability.label}
            title={locale === "es" ? t.title : (capability.label ?? t.title)}
            description={promotions.length === 0 ? t.empty : undefined}
          />
          <Stagger className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            {promotions.map((promotion) => (
              <StaggerItem key={promotion.id}>
                <Card className="h-full">
                  <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                    <CardTitle>{promotion.title}</CardTitle>
                    {promotion.badge ? <Badge>{promotion.badge}</Badge> : null}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {promotion.body}
                    </p>
                    {promotion.ends_at ? (
                      <p className="text-muted-foreground text-xs">
                        {t.ends}{" "}
                        {new Date(promotion.ends_at).toLocaleDateString(
                          locale === "es" ? "es" : "en-US",
                          { month: "long", day: "numeric" },
                        )}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
      <Cta title={t.cta} actions={[{ label: t.contact, href: "/contact" }]} />
    </>
  );
}
