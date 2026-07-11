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

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={capability.label}
            title={capability.label ?? "Current Specials"}
            description={
              promotions.length === 0 ? "Nothing running right now — check back soon." : undefined
            }
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
                        Ends{" "}
                        {new Date(promotion.ends_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
      <Cta title="Questions?" actions={[{ label: "Contact us", href: "/contact" }]} />
    </>
  );
}
