"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { activeTheme } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * The interactive core of the Carousel layout — the ONLY new client leaf in the
 * layout set. A scroll-snap track with prev/next controls and arrow-key
 * support. When motion is disabled (user's reduced-motion preference OR a
 * theme with `motion.intensity: "none"`), it renders a plain static grid with
 * no controls — the accessible, no-JS-needed fallback. Content-blind: children
 * are the slides.
 */
type CarouselTrackProps = {
  children: ReactNode;
  /** Slide width: sm=16rem, md=20rem (default), lg=24rem. */
  itemWidth?: "sm" | "md" | "lg";
  /** Accessible label for the track region. */
  label?: string;
};

const ITEM_WIDTH = {
  sm: "[&>*]:w-64",
  md: "[&>*]:w-80",
  lg: "[&>*]:w-96",
};

// Evaluated once; the active theme is fixed per build.
const themeDisablesMotion = activeTheme.motion.intensity === "none";

export function CarouselTrack({
  children,
  itemWidth = "md",
  label = "Carousel",
}: CarouselTrackProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);

  if (reduceMotion || themeDisablesMotion) {
    return <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
  }

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scroll(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(-1);
    }
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn(
          "flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4",
          "focus-visible:ring-ring rounded-lg focus-visible:ring-2 focus-visible:outline-none",
          "[&>*]:shrink-0 [&>*]:snap-start",
          ITEM_WIDTH[itemWidth],
        )}
      >
        {children}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Previous"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Next"
          onClick={() => scroll(1)}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
