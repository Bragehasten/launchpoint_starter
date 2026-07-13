import type { ReactNode } from "react";

import { Stagger } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

/**
 * Timeline rail — an ordered vertical sequence of steps connected by a rail,
 * each marked with a node dot. For process / history / event sections.
 * Content-blind: children are the steps (each a StaggerItem or `<li>`); the
 * rail line and dots are drawn in CSS around them.
 *
 * @example
 *   <TimelineRail>{steps.map(s => <StaggerItem key={s.title}>…</StaggerItem>)}</TimelineRail>
 */
type TimelineRailProps = {
  children: ReactNode;
  className?: string;
};

export function TimelineRail({ children, className }: TimelineRailProps) {
  return (
    <Stagger
      className={cn(
        // the rail
        "relative flex flex-col gap-8",
        "before:bg-border before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px",
        // each step: indented, with a node dot punched over the rail
        "[&>*]:relative [&>*]:pl-8",
        "[&>*]:before:bg-primary [&>*]:before:border-background [&>*]:before:absolute [&>*]:before:top-1.5 [&>*]:before:left-0 [&>*]:before:size-4 [&>*]:before:rounded-full [&>*]:before:border-2",
        className,
      )}
    >
      {children}
    </Stagger>
  );
}
