import Image from "next/image";

import type { Background } from "@/lib/design/variants";
import { cn } from "@/lib/utils";

type BackgroundLayerProps = {
  /** Background strategy. `solid` (default) renders nothing. */
  background?: Background;
  /** Image URL — required when `background` is `"image"`. */
  backgroundImage?: string;
  className?: string;
};

/**
 * Decorative, `aria-hidden` background layer for a {@link SectionShell}. Sits
 * absolutely behind the section's content (the shell adds `relative isolate`
 * when a layer is present). `solid` renders `null`, so a default section keeps
 * today's exact markup. Colors come entirely from tokens.
 *
 * @example
 *   <BackgroundLayer background="gradient" />
 */
export function BackgroundLayer({
  background = "solid",
  backgroundImage,
  className,
}: BackgroundLayerProps) {
  if (background === "solid") return null;

  if (background === "gradient") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-10", className)}
        // CSS-var bridge: gradient stops are theme tokens, direction is fixed.
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))",
        }}
      />
    );
  }

  if (background === "pattern") {
    return (
      <div
        aria-hidden
        className={cn(
          "text-foreground pointer-events-none absolute inset-0 -z-10 opacity-[0.04]",
          "[background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]",
          className,
        )}
      />
    );
  }

  // background === "image"
  if (!backgroundImage) return null;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
      <div className="bg-overlay-scrim absolute inset-0" />
    </div>
  );
}
