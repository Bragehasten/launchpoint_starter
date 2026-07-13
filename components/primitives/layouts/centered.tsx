import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Centered single column — a width-constrained, horizontally-centered stack,
 * used by centered heros, CTAs, and prose-led sections. Content-blind; owns
 * measure + centering only.
 *
 * @example
 *   <Centered maxWidth="md">{children}</Centered>
 */
type CenteredProps = {
  children: ReactNode;
  /** Measure cap: sm=xl, md=2xl (default), lg=4xl, xl=6xl. */
  maxWidth?: "sm" | "md" | "lg" | "xl";
  /** Gap scale: sm=4, md=6 (default), lg=8. */
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const MAX_WIDTH = { sm: "max-w-xl", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
const GAP = { sm: "gap-4", md: "gap-6", lg: "gap-8" };

export function Centered({ children, maxWidth = "md", gap = "md", className }: CenteredProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col items-center text-center",
        GAP[gap],
        MAX_WIDTH[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
