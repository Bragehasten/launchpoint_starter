import type { Metadata } from "next";
import { LocalLink as Link } from "@/components/shared/local-link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientConfig } from "@/config/client";
import { getCapability } from "@/lib/capabilities";
import { getServiceAreas } from "@/lib/capabilities/queries";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("serviceAreas");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Service Areas", path: "/service-areas" });
}

/** Index of every city/region the business serves — the internal-link hub. */
export default async function ServiceAreasPage() {
  const capability = getCapability("serviceAreas");
  if (!capability.enabled) notFound();

  const areas = await getServiceAreas();
  const locale = await getLocale();
  const noun =
    (locale === "es" ? capability.serviceNounEs : undefined) ??
    capability.serviceNoun ??
    clientConfig.module.label;

  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={capability.label}
          title={capability.label ?? "Service Areas"}
          description={
            capability.intro ??
            (areas.length > 0
              ? `${noun} across ${areas.length} ${areas.length === 1 ? "area" : "areas"}. Find yours below.`
              : "Add service areas in Admin → Service Areas to fill this page.")
          }
        />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <StaggerItem key={area.id}>
              <Link href={`/service-areas/${area.slug}`} className="group block h-full">
                <Card className="group-hover:border-primary/50 h-full transition-colors">
                  <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <MapPin className="text-primary size-4 shrink-0" aria-hidden="true" />
                    <CardTitle>
                      {area.name}
                      {area.region ? `, ${area.region}` : ""}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-muted-foreground line-clamp-3 text-sm">{area.intro}</p>
                    <span className="text-primary inline-flex items-center gap-1.5 text-sm font-medium">
                      {noun} in {area.name}
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
