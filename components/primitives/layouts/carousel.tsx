import type { ReactNode } from "react";

import { CarouselTrack } from "@/components/primitives/layouts/carousel-controls";

/**
 * Carousel layout — a horizontally scroll-snapping track of slides with
 * keyboard-navigable controls, degrading to a static grid when motion is off.
 * This server wrapper embeds the sole client leaf ({@link CarouselTrack}); the
 * section stays a server component. Content-blind: children are the slides.
 *
 * @example
 *   <Carousel itemWidth="md" label="Testimonials">
 *     {testimonials.map(t => <Card key={t.author}>…</Card>)}
 *   </Carousel>
 */
type CarouselProps = {
  children: ReactNode;
  itemWidth?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export function Carousel({ children, itemWidth, label, className }: CarouselProps) {
  return (
    <div className={className}>
      <CarouselTrack itemWidth={itemWidth} label={label}>
        {children}
      </CarouselTrack>
    </div>
  );
}
