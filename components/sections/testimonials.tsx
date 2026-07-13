import Image from "next/image";

import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { Carousel } from "@/components/primitives/layouts/carousel";
import { Masonry } from "@/components/primitives/layouts/masonry";
import { SectionShell } from "@/components/primitives/section-shell";
import type { SectionHeadingProps } from "@/components/sections/section-heading";
import { StaggerItem } from "@/components/shared/motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { SectionVariantProps } from "@/lib/design/variants";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
};

/** "grid" (default), "carousel", or "masonry". */
export type TestimonialsLayout = "grid" | "carousel" | "masonry";

export type TestimonialsProps = SectionVariantProps & {
  heading: Omit<SectionHeadingProps, "className">;
  testimonials: Testimonial[];
  layout?: TestimonialsLayout;
};

/** One quote card — shared across layouts. */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <blockquote className="text-sm leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </CardContent>
      <CardFooter className="gap-3">
        {testimonial.avatar ? (
          <Image src={testimonial.avatar} alt="" width={36} height={36} className="rounded-full" />
        ) : (
          <div
            aria-hidden="true"
            className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-xs font-medium"
          >
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div className="text-sm">
          <p className="font-medium">{testimonial.author}</p>
          {testimonial.role ? (
            <p className="text-muted-foreground text-xs">{testimonial.role}</p>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Testimonials — a SectionShell heading over quote cards. The grid default is
 * pixel-equivalent to the previous markup; carousel and masonry are opt-in.
 *
 * @example
 *   <Testimonials heading={{ title: "Loved by teams" }} testimonials={list} />
 */
export function Testimonials({
  heading,
  testimonials,
  layout = "grid",
  surface,
  density,
  background,
  backgroundImage,
}: TestimonialsProps) {
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
        <Carousel label={heading.title} itemWidth="md">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </Carousel>
      ) : layout === "masonry" ? (
        <Masonry columns={3}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </Masonry>
      ) : (
        <CardGrid sm={2} lg={3}>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <TestimonialCard testimonial={testimonial} />
            </StaggerItem>
          ))}
        </CardGrid>
      )}
    </SectionShell>
  );
}
