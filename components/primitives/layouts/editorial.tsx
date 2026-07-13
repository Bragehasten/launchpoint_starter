import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Editorial — an asymmetric, type-led layout: a lead column (heading / intro,
 * optionally sticky) beside a wider flowing body. Collapses to a single column
 * on mobile. Content-blind; owns proportions only. Suits list-style Services /
 * Menu / Pricing and long-form sections.
 *
 * @example
 *   <Editorial lead={<ContentBlock … />}>{items}</Editorial>
 */
type EditorialProps = {
  /** The narrower lead column (title/intro). */
  lead: ReactNode;
  /** The wider body column. */
  children: ReactNode;
  /** Keep the lead column sticky while the body scrolls. */
  stickyLead?: boolean;
  /** Gap scale: md=10, lg=16 (default). */
  gap?: "md" | "lg";
  className?: string;
};

const GAP = { md: "gap-10", lg: "gap-16" };

export function Editorial({ lead, children, stickyLead, gap = "lg", className }: EditorialProps) {
  return (
    <div className={cn("grid lg:grid-cols-[2fr_3fr]", GAP[gap], className)}>
      <div className={cn(stickyLead && "lg:sticky lg:top-24 lg:self-start")}>{lead}</div>
      <div>{children}</div>
    </div>
  );
}
