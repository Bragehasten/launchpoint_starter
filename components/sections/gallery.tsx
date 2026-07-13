import Image from "next/image";

import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { Carousel } from "@/components/primitives/layouts/carousel";
import { SectionShell } from "@/components/primitives/section-shell";
import type { SectionHeadingProps } from "@/components/sections/section-heading";
import type { SectionVariantProps } from "@/lib/design/variants";

export type GalleryImage = {
  src: string;
  alt: string;
};

/**
 * "grid" (default) or "carousel". Masonry is deferred until images carry
 * intrinsic dimensions (fill images need a sized container).
 */
export type GalleryLayout = "grid" | "carousel";

export type GalleryProps = SectionVariantProps & {
  heading?: Omit<SectionHeadingProps, "className">;
  images: GalleryImage[];
  /** Columns at desktop width. */
  columns?: 2 | 3 | 4;
  layout?: GalleryLayout;
};

/**
 * Responsive image grid. The gallery capability (M10) feeds this from the media
 * library; until then it renders any list of images. The grid default is
 * pixel-equivalent to the previous markup; carousel is opt-in.
 *
 * @example
 *   <Gallery heading={{ title: "Recent work" }} images={images} columns={3} />
 */
export function Gallery({
  heading,
  images,
  columns = 3,
  layout = "grid",
  surface,
  density,
  background,
  backgroundImage,
}: GalleryProps) {
  return (
    <SectionShell
      heading={heading}
      containerClassName="flex flex-col gap-12"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      {layout === "carousel" ? (
        <Carousel label={heading?.title ?? "Gallery"} itemWidth="md">
          {images.map((image) => (
            <div
              key={image.src}
              className="bg-muted relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <CardGrid as="ul" motion="fade" base={2} lg={columns === 2 ? undefined : columns} gap="xs">
          {images.map((image) => (
            <li
              key={image.src}
              className="bg-muted relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </li>
          ))}
        </CardGrid>
      )}
    </SectionShell>
  );
}
