import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Sidebar — a main content column beside a fixed-measure aside (filters, NAP
 * block, secondary nav), collapsing to a single column on mobile. Content-blind;
 * owns placement only. `side` picks which edge the aside sits on.
 *
 * @example
 *   <Sidebar aside={<Filters />} side="start" stickyAside>{results}</Sidebar>
 */
type SidebarProps = {
  children: ReactNode;
  aside: ReactNode;
  /** Which side the aside sits on at lg. Default "end". */
  side?: "start" | "end";
  /** Keep the aside sticky while the main column scrolls. */
  stickyAside?: boolean;
  /** Aside measure: sm=16rem, md=20rem (default). */
  asideWidth?: "sm" | "md";
  className?: string;
};

const COLS = {
  "start-sm": "lg:grid-cols-[16rem_1fr]",
  "start-md": "lg:grid-cols-[20rem_1fr]",
  "end-sm": "lg:grid-cols-[1fr_16rem]",
  "end-md": "lg:grid-cols-[1fr_20rem]",
};

export function Sidebar({
  children,
  aside,
  side = "end",
  stickyAside,
  asideWidth = "md",
  className,
}: SidebarProps) {
  const asideNode = (
    <aside className={cn(stickyAside && "lg:sticky lg:top-24 lg:self-start")}>{aside}</aside>
  );
  return (
    <div className={cn("grid gap-10", COLS[`${side}-${asideWidth}`], className)}>
      {side === "start" ? asideNode : null}
      <div>{children}</div>
      {side === "end" ? asideNode : null}
    </div>
  );
}
