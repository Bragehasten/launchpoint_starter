import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Layered — stacks an overlay over a base in the same grid cell (no absolute
 * positioning gymnastics), for floating cards over media, glass panels, or
 * offset hero art. Content-blind; owns stacking + overlay placement only.
 *
 * @example
 *   <Layered base={<MediaBlock … />} overlay={<Card>…</Card>} place="bottom-start" />
 */
type Place = "center" | "top-start" | "top-end" | "bottom-start" | "bottom-end";

type LayeredProps = {
  base: ReactNode;
  overlay: ReactNode;
  /** Where the overlay sits within the cell. Default "bottom-start". */
  place?: Place;
  className?: string;
};

const PLACE: Record<Place, string> = {
  center: "place-self-center",
  "top-start": "place-self-start",
  "top-end": "justify-self-end self-start",
  "bottom-start": "justify-self-start self-end",
  "bottom-end": "place-self-end",
};

export function Layered({ base, overlay, place = "bottom-start", className }: LayeredProps) {
  return (
    <div className={cn("grid [&>*]:col-start-1 [&>*]:row-start-1", className)}>
      {base}
      <div className={cn("z-10 m-4", PLACE[place])}>{overlay}</div>
    </div>
  );
}
