import type { ReactNode } from "react";

import { FadeIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

/**
 * Masonry — a balanced multi-column flow (CSS columns) for mixed-height tiles
 * like galleries and quote walls. Content-blind: children flow into the columns
 * in order; each child avoids breaking across a column. Pure CSS, zero client
 * JS. Owns geometry only.
 *
 * @example
 *   <Masonry columns={3}>{images.map(img => <figure key={img.src}>…</figure>)}</Masonry>
 */
type MasonryProps = {
  children: ReactNode;
  /** Desktop column count. Default 3. */
  columns?: 2 | 3 | 4;
  /** Gap scale: sm=3, md=4 (default), lg=6. */
  gap?: "sm" | "md" | "lg";
  /** Entrance behaviour. Default "fade" (whole grid). */
  motion?: "fade" | "none";
  className?: string;
};

const COLUMNS = {
  2: "columns-1 sm:columns-2",
  3: "columns-2 lg:columns-3",
  4: "columns-2 lg:columns-4",
};
// gap sets column-gap; the matching bottom margin keeps vertical rhythm even.
const GAP = {
  sm: "gap-3 [&>*]:mb-3",
  md: "gap-4 [&>*]:mb-4",
  lg: "gap-6 [&>*]:mb-6",
};

export function Masonry({
  children,
  columns = 3,
  gap = "md",
  motion = "fade",
  className,
}: MasonryProps) {
  const flow = (
    <div className={cn(COLUMNS[columns], GAP[gap], "[&>*]:break-inside-avoid", className)}>
      {children}
    </div>
  );
  return motion === "fade" ? <FadeIn>{flow}</FadeIn> : flow;
}
