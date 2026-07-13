import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Vertical stack — the simplest layout: children in a column with a consistent
 * gap and optional cross-axis alignment. Content-blind; owns spacing only, not
 * vertical section rhythm (that's SectionShell's job).
 *
 * @example
 *   <Stack gap="lg" align="center">{children}</Stack>
 */
type StackProps = {
  children: ReactNode;
  /** Gap scale: sm=4, md=6 (default), lg=8, xl=12. */
  gap?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end";
  className?: string;
};

const GAP = { sm: "gap-4", md: "gap-6", lg: "gap-8", xl: "gap-12" };
const ALIGN = { start: "items-start", center: "items-center", end: "items-end" };

export function Stack({ children, gap = "md", align = "start", className }: StackProps) {
  return <div className={cn("flex flex-col", GAP[gap], ALIGN[align], className)}>{children}</div>;
}
