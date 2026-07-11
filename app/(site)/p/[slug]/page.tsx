import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/shared/section-renderer";
import { getPublishedPageBySlug } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

/**
 * Public route for CMS-built pages: /p/<slug>.
 * (Universal pages like /about get dedicated routes in M8; this route is
 * for client-specific landing pages built entirely in the admin.)
 */

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return {};
  return createMetadata({
    title: page.title,
    description: page.description ?? undefined,
    path: `/p/${page.slug}`,
  });
}

export default async function CmsPublicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();

  return <SectionRenderer blocks={page.blocks} />;
}
