import type { Metadata } from "next";
import { LocalLink as Link } from "@/components/shared/local-link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Star } from "lucide-react";

import { DynamicForm } from "@/components/forms/dynamic-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientConfig } from "@/config/client";
import { formRegistry, getFormDef } from "@/config/forms";
import { siteConfig } from "@/config/site";
import { getCapability, isCapabilityEnabled } from "@/lib/capabilities";
import {
  getLocationBySlug,
  getLocationReviews,
  getTeamAtLocation,
} from "@/lib/capabilities/queries";
import { resolveFormDef, toClientDef } from "@/lib/forms/types";
import { getDict, interpolate } from "@/lib/i18n";
import { createMetadata, JsonLd, locationBusinessJsonLd } from "@/lib/seo";
import type { Json } from "@/types/json";

/**
 * Location landing page — the multi-location SEO unit. Each location is its
 * own LocalBusiness entity: NAP, hours, map, curated reviews, staff, and a
 * contact form, all on a crawlable URL.
 */

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!isCapabilityEnabled("locations")) return {};
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return {};
  return createMetadata({
    title: location.name,
    description:
      location.intro ?? `${siteConfig.name} — ${location.name}. Visit us at ${location.address}.`,
    path: `/locations/${slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapability("locations");
  if (!capability.enabled) notFound();

  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const [reviews, team] = await Promise.all([
    getLocationReviews(location.id),
    isCapabilityEnabled("team") ? getTeamAtLocation(location.id) : Promise.resolve([]),
  ]);
  const hours = parseHours(location.hours);
  const { locale, dict } = await getDict();
  const baseContactDef = getFormDef("contact") ?? formRegistry.contact ?? null;
  const contactDef = baseContactDef ? resolveFormDef(baseContactDef, locale) : null;

  const jsonLd = locationBusinessJsonLd({
    businessType: clientConfig.module.businessType,
    name: location.name,
    url: `${siteConfig.url}/locations/${location.slug}`,
    address: location.address,
    city: location.city,
    region: location.region,
    postalCode: location.postal_code,
    telephone: location.phone,
    latitude: location.latitude,
    longitude: location.longitude,
    reviews: reviews.map((r) => ({ author: r.author, rating: r.rating, body: r.body })),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Section>
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Link
              href="/locations"
              className="text-muted-foreground inline-flex w-fit items-center gap-1.5 text-sm hover:underline"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {dict.locations.allLocations}
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="heading text-3xl text-balance sm:text-4xl">{location.name}</h1>
              {location.is_primary ? (
                <Badge variant="secondary">{dict.locations.mainLocation}</Badge>
              ) : null}
            </div>
            {location.intro ? (
              <p className="text-muted-foreground max-w-2xl text-lg">{location.intro}</p>
            ) : null}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <FadeIn className="flex flex-col gap-4 text-sm">
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
            </FadeIn>
            {location.map_embed_url ? (
              <FadeIn delay={0.1}>
                <iframe
                  src={location.map_embed_url}
                  title={`Map — ${location.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full rounded-xl border sm:h-96"
                />
              </FadeIn>
            ) : null}
          </div>

          {team.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="heading text-2xl">{dict.locations.teamHere}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                  <li key={member.id}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>{member.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{member.role}</p>
                      </CardHeader>
                      {member.bio ? (
                        <CardContent>
                          <p className="text-muted-foreground text-sm">{member.bio}</p>
                        </CardContent>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="heading text-2xl">{dict.locations.customersSay}</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                  <li key={review.id}>
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col gap-3 pt-6">
                        <div
                          className="flex items-center gap-0.5"
                          role="img"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              aria-hidden="true"
                              className={
                                i < review.rating
                                  ? "fill-primary text-primary size-4"
                                  : "text-muted-foreground/40 size-4"
                              }
                            />
                          ))}
                        </div>
                        <blockquote className="flex-1 text-sm leading-relaxed">
                          {review.body}
                        </blockquote>
                        <p className="text-muted-foreground text-xs">
                          {review.author} · via {review.source}
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {contactDef ? (
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
              <SectionHeading
                title={interpolate(dict.locations.contactLocation, { name: location.name })}
                description={dict.locations.contactLocationBody}
              />
              <DynamicForm def={toClientDef(contactDef)} />
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
