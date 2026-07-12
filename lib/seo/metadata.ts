import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { isMultilingual } from "@/lib/i18n/config";

/**
 * Metadata factory. Every page builds its metadata through this helper so
 * titles, canonicals, Open Graph, and Twitter cards stay consistent.
 *
 * OG images come from the file conventions (app/opengraph-image.tsx and
 * per-route variants) unless a page passes an explicit `image`.
 */

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  /** Route path beginning with "/", used for the canonical URL. */
  path: string;
  /** Explicit OG image URL (e.g. a post's cover image). */
  image?: string;
  type?: "website" | "article";
  /** ISO date — only meaningful with type "article". */
  publishedTime?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path,
  image,
  type = "website",
  publishedTime,
  noIndex,
}: CreateMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const esUrl = `${siteConfig.url}/es${path === "/" ? "" : path}`;

  return {
    title,
    description,
    // Canonical points at the English URL; hreflang advertises both language
    // variants (per-locale self-canonicals: backlog — needs the 12
    // const-metadata pages converted to generateMetadata).
    alternates: {
      canonical: url,
      ...(isMultilingual() ? { languages: { en: url, es: esUrl, "x-default": url } } : {}),
    },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: title ?? siteConfig.name,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
