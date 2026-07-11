import type { MetadataRoute } from "next";

import { enabledForms } from "@/config/forms";
import { siteConfig } from "@/config/site";
import { CAPABILITY_PATHS, enabledCapabilities } from "@/lib/capabilities";
import { createClient } from "@/lib/supabase/server";

/**
 * Sitemap: static marketing routes + published CMS content.
 * Draft/scheduled content is excluded automatically (RLS + explicit filters).
 * When the capability layer lands (M10), enabled capability routes join here.
 */

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/gallery", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/careers", priority: 0.5 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

const CAPABILITY_ROUTES_WITH_PAGES = new Set([
  "team",
  "services",
  "locations",
  "promotions",
  "quotes",
  "booking",
  "serviceAreas",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const capabilityRoutes = enabledCapabilities()
    .filter((key) => CAPABILITY_ROUTES_WITH_PAGES.has(key))
    .map((key) => ({ path: CAPABILITY_PATHS[key], priority: 0.8 }));

  // Engine forms with their own pages. Contact/quote keep classic URLs
  // (already in the lists above), so skip them here.
  const formRoutes = enabledForms
    .filter((slug) => slug !== "contact" && slug !== "quote")
    .map((slug) => ({ path: `/forms/${slug}`, priority: 0.6 }));

  const supabase = await createClient();
  const now = new Date().toISOString();

  const enabled = enabledCapabilities();
  const locationsEnabled = enabled.includes("locations");
  const areasEnabled = enabled.includes("serviceAreas");

  const [{ data: posts }, { data: pages }, { data: locations }, { data: areas }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("slug, updated_at")
        .eq("status", "published")
        .lte("published_at", now),
      supabase
        .from("cms_pages")
        .select("slug, updated_at")
        .eq("status", "published")
        .lte("published_at", now),
      locationsEnabled
        ? supabase.from("locations").select("slug, updated_at").eq("active", true)
        : Promise.resolve({ data: [] as { slug: string; updated_at: string }[] }),
      areasEnabled
        ? supabase.from("service_areas").select("slug, updated_at").eq("active", true)
        : Promise.resolve({ data: [] as { slug: string; updated_at: string }[] }),
    ]);

  return [
    ...[...STATIC_ROUTES, ...capabilityRoutes, ...formRoutes].map((route) => ({
      url: `${siteConfig.url}${route.path === "/" ? "" : route.path}`,
      priority: route.priority,
      changeFrequency: "weekly" as const,
    })),
    ...(posts ?? []).map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updated_at,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...(pages ?? []).map((page) => ({
      url: `${siteConfig.url}/p/${page.slug}`,
      lastModified: page.updated_at,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    // Location landing pages: high priority — they're the local-SEO surface.
    ...(locations ?? []).map((location) => ({
      url: `${siteConfig.url}/locations/${location.slug}`,
      lastModified: location.updated_at,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    // Service-area pages: the trades' local-SEO surface.
    ...(areas ?? []).map((area) => ({
      url: `${siteConfig.url}/service-areas/${area.slug}`,
      lastModified: area.updated_at,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
  ];
}
