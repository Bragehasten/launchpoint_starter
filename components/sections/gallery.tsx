import Image from "next/image";

import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryProps = {
  heading?: Omit<SectionHeadingProps, "className">;
  images: GalleryImage[];
  /** Columns at desktop width. */
  columns?: 2 | 3 | 4;
};

/**
 * Responsive image grid. The gallery capability (M10) feeds this from the
 * media library; until then it renders any list of images.
 */
export function Gallery({ heading, images, columns = 3 }: GalleryProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        {heading ? <SectionHeading {...heading} /> : null}
        <FadeIn>
          <ul
            className={cn(
              "grid grid-cols-2 gap-3 sm:gap-4",
              columns === 3 && "lg:grid-cols-3",
              columns === 4 && "lg:grid-cols-4",
            )}
          >
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
          </ul>
        </FadeIn>
      </Container>
    </Section>
  );
}
