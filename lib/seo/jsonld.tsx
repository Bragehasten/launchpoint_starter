import { siteConfig } from "@/config/site";

/**
 * JSON-LD structured data generators.
 *
 * Typed, minimal, and validated against schema.org expectations. Each
 * generator returns a plain object; render with <JsonLd data={...} />.
 * LocalBusiness is parameterized so industry modules (M10+) can supply
 * their business type and details from module config.
 */

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be embedded as a raw script; content is generated from
      // our own typed config/data, never raw user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    ...(Object.values(siteConfig.links).some(Boolean)
      ? { sameAs: Object.values(siteConfig.links).filter(Boolean) }
      : {}),
  };
}

export function articleJsonLd(options: {
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  authorName?: string | null;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    ...(options.description ? { description: options.description } : {}),
    url: options.url,
    ...(options.image ? { image: [options.image] } : {}),
    ...(options.publishedAt ? { datePublished: options.publishedAt } : {}),
    ...(options.modifiedAt ? { dateModified: options.modifiedAt } : {}),
    ...(options.authorName
      ? { author: { "@type": "Person", name: options.authorName } }
      : { author: { "@type": "Organization", name: siteConfig.name } }),
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type LocalBusinessInfo = {
  /** schema.org LocalBusiness subtype, e.g. "Barbershop", "Restaurant". */
  businessType: string;
  telephone?: string;
  priceRange?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  /** e.g. ["Mo-Fr 09:00-17:00", "Sa 10:00-14:00"] */
  openingHours?: string[];
};

export type LocationBusinessInfo = {
  businessType: string;
  name: string;
  /** Absolute URL of the location's landing page. */
  url: string;
  address: string;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  telephone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  reviews?: { author: string; rating: number; body: string }[];
};

/**
 * Per-location LocalBusiness entity — the core of multi-location SEO.
 * Each location page gets its own entity with its own address, geo, and
 * (when curated reviews exist) aggregateRating.
 */
export function locationBusinessJsonLd(info: LocationBusinessInfo): JsonLdObject {
  const reviews = info.reviews ?? [];
  const ratingValue =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  return {
    "@context": "https://schema.org",
    "@type": info.businessType,
    name: `${siteConfig.name} — ${info.name}`,
    url: info.url,
    parentOrganization: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    address: {
      "@type": "PostalAddress",
      streetAddress: info.address,
      ...(info.city ? { addressLocality: info.city } : {}),
      ...(info.region ? { addressRegion: info.region } : {}),
      ...(info.postalCode ? { postalCode: info.postalCode } : {}),
    },
    ...(info.telephone ? { telephone: info.telephone } : {}),
    ...(info.latitude != null && info.longitude != null
      ? { geo: { "@type": "GeoCoordinates", latitude: info.latitude, longitude: info.longitude } }
      : {}),
    ...(ratingValue != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue,
            reviewCount: reviews.length,
            bestRating: 5,
          },
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.body,
          })),
        }
      : {}),
  };
}

/**
 * Service-area page entity: a Service provided by the business, scoped to a
 * city — the structured-data half of "Roofing in Jupiter, FL".
 */
export function serviceAreaJsonLd(info: {
  serviceNoun: string;
  businessType: string;
  areaName: string;
  region?: string | null;
  url: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${info.serviceNoun} in ${info.areaName}${info.region ? `, ${info.region}` : ""}`,
    serviceType: info.serviceNoun,
    url: info.url,
    provider: {
      "@type": info.businessType,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: { "@type": "City", name: info.areaName },
  };
}

/** Wired per-client when industry modules land (module `seo.businessType`). */
export function localBusinessJsonLd(info: LocalBusinessInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": info.businessType,
    name: siteConfig.name,
    url: siteConfig.url,
    ...(info.telephone ? { telephone: info.telephone } : {}),
    ...(info.priceRange ? { priceRange: info.priceRange } : {}),
    ...(info.address ? { address: { "@type": "PostalAddress", ...info.address } } : {}),
    ...(info.openingHours ? { openingHoursSpecification: info.openingHours } : {}),
  };
}
