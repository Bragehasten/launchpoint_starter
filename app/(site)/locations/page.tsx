import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCapability } from "@/lib/capabilities";
import { getLocations } from "@/lib/capabilities/queries";
import { createMetadata } from "@/lib/seo";
import type { Json } from "@/types/json";

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("locations");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Locations", path: "/locations" });
}

type HoursEntry = { days: string; hours: string };

function parseHours(hours: Json): HoursEntry[] {
  if (!Array.isArray(hours)) return [];
  return hours.filter(
    (entry): entry is HoursEntry =>
      typeof entry === "object" &&
      entry !== null &&
      !Array.isArray(entry) &&
      typeof entry.days === "string" &&
      typeof entry.hours === "string",
  );
}

export default async function LocationsPage() {
  const capability = getCapability("locations");
  if (!capability.enabled) notFound();

  const locations = await getLocations();

  // One location = its landing page IS the locations page.
  if (locations.length === 1 && locations[0]) {
    redirect(`/locations/${locations[0].slug}`);
  }

  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={capability.label}
          title={capability.label ?? "Locations & Hours"}
          description={
            locations.length === 0
              ? "Add locations in Admin → Locations to fill this page."
              : undefined
          }
        />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {locations.map((location) => {
            const hours = parseHours(location.hours);
            return (
              <StaggerItem key={location.id}>
                <Card className="h-full">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle>{location.name}</CardTitle>
                    {location.is_primary ? <Badge variant="secondary">Main</Badge> : null}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {location.map_url ? (
                        <a
                          href={location.map_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {location.address}
                        </a>
                      ) : (
                        location.address
                      )}
                    </p>
                    {location.phone ? (
                      <p className="flex items-center gap-2">
                        <Phone className="text-primary size-4 shrink-0" aria-hidden="true" />
                        <a
                          href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
                          className="hover:underline"
                        >
                          {location.phone}
                        </a>
                      </p>
                    ) : null}
                    {location.email ? (
                      <p className="flex items-center gap-2">
                        <Mail className="text-primary size-4 shrink-0" aria-hidden="true" />
                        <a href={`mailto:${location.email}`} className="hover:underline">
                          {location.email}
                        </a>
                      </p>
                    ) : null}
                    {hours.length > 0 ? (
                      <div className="flex items-start gap-2">
                        <Clock className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                          {hours.map((entry) => (
                            <div key={entry.days} className="contents">
                              <dt className="text-muted-foreground">{entry.days}</dt>
                              <dd className="text-right tabular-nums">{entry.hours}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                    <Link
                      href={`/locations/${location.slug}`}
                      className="text-primary mt-1 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    >
                      View location
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
