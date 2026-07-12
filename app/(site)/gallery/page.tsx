import type { Metadata } from "next";

import { Cta, Gallery } from "@/components/sections";
import { createMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description: "A look at our recent work.",
  path: "/gallery",
});

const en = {
  eyebrow: "Gallery",
  title: "Recent work",
  emptyDescription: "Upload images in the admin media library to fill this page.",
  cta: { title: "Like what you see?", action: "Start your project" },
};

const es: typeof en = {
  eyebrow: "Galería",
  title: "Trabajos recientes",
  emptyDescription: "Sube imágenes en la biblioteca multimedia del administrador para llenar esta página.",
  cta: { title: "¿Te gusta lo que ves?", action: "Inicia tu proyecto" },
};

const content = { en, es };

/**
 * Gallery page fed by the media library — anything uploaded in
 * /admin/media appears here automatically. The gallery capability (M10)
 * replaces this with curated albums.
 */
export default async function GalleryPage() {
  const t = content[await getLocale()];
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("media")
    .select("path, alt")
    .order("created_at", { ascending: false })
    .limit(24);

  const images = (items ?? []).map((item) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(item.path);
    return { src: publicUrl, alt: item.alt ?? "" };
  });

  return (
    <>
      {images.length > 0 ? (
        <Gallery heading={{ eyebrow: t.eyebrow, title: t.title }} images={images} />
      ) : (
        <Gallery
          heading={{ eyebrow: t.eyebrow, title: t.title, description: t.emptyDescription }}
          images={[]}
        />
      )}
      <Cta title={t.cta.title} actions={[{ label: t.cta.action, href: "/contact" }]} />
    </>
  );
}
