import type { ReactNode } from "react";

import { FadeIn, Stagger } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

/**
 * The one card-grid layout — replaces the near-identical grids that had
 * accreted across Features, Testimonials, Team, Gallery, and the locations /
 * service-areas indexes. Content-blind: it lays out whatever slotted children
 * it's given (Cards, StaggerItems, `<li>` media tiles) and owns only geometry +
 * entrance choreography, never copy.
 *
 * Columns are set per breakpoint (`base`/`sm`/`lg`); omit a breakpoint to
 * inherit the previous one. `base` of 1 emits no class (CSS grid's default).
 * `motion="stagger"` (default) expects StaggerItem children; `"fade"` wraps the
 * whole grid in one FadeIn (image grids); `"none"` is static.
 *
 * @example
 *   <CardGrid sm={2} lg={3}>{features.map(f => <StaggerItem key={f.title}>…</StaggerItem>)}</CardGrid>
 *   <CardGrid as="ul" motion="fade" base={2} lg={3} gap="xs">{tiles}</CardGrid>
 */
type CardGridProps = {
  children: ReactNode;
  /** Mobile columns. 1 (default) emits no class. */
  base?: 1 | 2;
  /** Columns at the sm breakpoint. */
  sm?: 2 | 3;
  /** Columns at the lg breakpoint. */
  lg?: 2 | 3 | 4;
  /** Gap scale: xs=3→sm:4, sm=4, md=6 (default), lg=8. */
  gap?: "xs" | "sm" | "md" | "lg";
  /** Entrance behaviour. */
  motion?: "stagger" | "fade" | "none";
  /** Grid element. `ul` for semantic media lists. */
  as?: "div" | "ul";
  className?: string;
};

const GAP: Record<NonNullable<CardGridProps["gap"]>, string> = {
  xs: "gap-3 sm:gap-4",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function CardGrid({
  children,
  base = 1,
  sm,
  lg,
  gap = "md",
  motion = "stagger",
  as = "div",
  className,
}: CardGridProps) {
  const gridClass = cn(
    "grid",
    GAP[gap],
    base === 2 && "grid-cols-2",
    sm === 2 && "sm:grid-cols-2",
    sm === 3 && "sm:grid-cols-3",
    lg === 2 && "lg:grid-cols-2",
    lg === 3 && "lg:grid-cols-3",
    lg === 4 && "lg:grid-cols-4",
    className,
  );

  if (motion === "stagger") {
    // All current stagger grids are <div>; ul is only used by fade image grids.
    return <Stagger className={gridClass}>{children}</Stagger>;
  }

  const Grid = as === "ul" ? "ul" : "div";
  const grid = <Grid className={gridClass}>{children}</Grid>;
  return motion === "fade" ? <FadeIn>{grid}</FadeIn> : grid;
}
