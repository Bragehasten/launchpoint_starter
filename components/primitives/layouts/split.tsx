import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Two-column split — a content column beside a media/aux column, collapsing to
 * a single column on mobile. Content-blind: `primary` and `secondary` are
 * slots, rendered as direct grid children (no wrapper nodes) so a section can
 * adopt it without changing its DOM. Geometry only: ratio, gap, vertical
 * alignment, reverse.
 *
 * @example
 *   <SplitLayout primary={<ContentBlock … />} secondary={<MediaBlock … />} />
 */
type Ratio = "1:1" | "6:5" | "2:1";

type SplitLayoutProps = {
  primary: ReactNode;
  secondary: ReactNode;
  /** Column proportions at lg. Default "1:1". */
  ratio?: Ratio;
  /** Gap scale: sm=6, md=8, lg=12 (default). */
  gap?: "sm" | "md" | "lg";
  /** Vertical alignment of the two columns. Default "center". */
  verticalAlign?: "start" | "center" | "stretch";
  /** Put the secondary column first at lg. */
  reverse?: boolean;
  className?: string;
};

const RATIO: Record<Ratio, string> = {
  "1:1": "lg:grid-cols-2",
  "6:5": "lg:grid-cols-[6fr_5fr]",
  "2:1": "lg:grid-cols-[2fr_1fr]",
};
const GAP = { sm: "gap-6", md: "gap-8", lg: "gap-12" };
const VALIGN = { start: "items-start", center: "items-center", stretch: "items-stretch" };

export function SplitLayout({
  primary,
  secondary,
  ratio = "1:1",
  gap = "lg",
  verticalAlign = "center",
  reverse = false,
  className,
}: SplitLayoutProps) {
  return (
    <div className={cn("grid", GAP[gap], VALIGN[verticalAlign], RATIO[ratio], className)}>
      {reverse ? (
        <>
          {secondary}
          {primary}
        </>
      ) : (
        <>
          {primary}
          {secondary}
        </>
      )}
    </div>
  );
}
