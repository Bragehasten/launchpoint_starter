import type { Metadata } from "next";

import { Cta, Gallery } from "@/components/sections";
import { createMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description: "A look at our recent work.",
  path: "/gallery",
});

/**
 * Gallery page fed by the media library — anything uploaded in
 * /admin/media appears here automatically. The gallery capability (M10)
 * replaces this with curated albums.
 */
export default async function GalleryPage() {
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
        <Gallery heading={{ eyebrow: "Gallery", title: "Recent work" }} images={images} />
      ) : (
        <Gallery
          heading={{
            eyebrow: "Gallery",
            title: "Recent work",
            description: "Upload images in the admin media library to fill this page.",
          }}
          images={[]}
        />
      )}
      <Cta
        title="Like what you see?"
        actions={[{ label: "Start your project", href: "/contact" }]}
      />
    </>
  );
}
