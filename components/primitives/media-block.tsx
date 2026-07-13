import Image from "next/image";

import { FadeIn } from "@/components/shared/motion";
import { activeTheme } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * A framed media slot — image, map, or embed — with a fixed aspect ratio and a
 * visual treatment. `treatment="hero"` reproduces the Hero split image exactly
 * (4:3, rounded, bordered, cover). `alt` is required for images at the type
 * level; maps/embeds treat it as an accessible title. Tokens only.
 *
 * @example
 *   <MediaBlock kind="image" src="/hero.jpg" alt="Team at work" treatment="hero" priority />
 */
type Aspect = "video" | "square" | "portrait" | "auto";
type Treatment = "plain" | "framed" | "hero";

type MediaBlockBase = {
  aspect?: Aspect;
  treatment?: Treatment;
  priority?: boolean;
  /** Entrance delay in seconds (matches the Hero media stagger of 0.15). */
  delay?: number;
  /** `next/image` sizes hint. */
  sizes?: string;
  className?: string;
};

export type MediaBlockProps =
  | (MediaBlockBase & { kind: "image"; src: string; alt: string })
  | (MediaBlockBase & { kind: "map" | "embed"; src: string; alt?: string });

const ASPECT_CLASS: Record<Aspect, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  auto: "",
};

const TREATMENT_CLASS: Record<Treatment, string> = {
  plain: "relative overflow-hidden",
  framed: "relative overflow-hidden rounded-xl border",
  hero: "relative aspect-[4/3] overflow-hidden rounded-xl border",
};

const DEFAULT_SIZES = "(min-width: 1024px) 50vw, 100vw";

// Theme personality supplies the default treatment/aspect when a caller omits
// them (spec §29 — MediaBlock consumes the imagery facet).
const IMAGERY = activeTheme.personality.imagery;
const CROP_TO_ASPECT: Record<typeof IMAGERY.crop, Aspect> = {
  square: "square",
  portrait: "portrait",
  landscape: "video",
  wide: "video",
};

export function MediaBlock(props: MediaBlockProps) {
  const {
    kind,
    src,
    aspect = CROP_TO_ASPECT[IMAGERY.crop],
    treatment = IMAGERY.treatment,
    priority = false,
    delay = 0,
    sizes = DEFAULT_SIZES,
    className,
  } = props;

  // `hero` treatment fixes its own 4:3 ratio; otherwise apply the aspect class.
  const frame = cn(
    TREATMENT_CLASS[treatment],
    treatment !== "hero" && ASPECT_CLASS[aspect],
    className,
  );

  return (
    <FadeIn delay={delay} className={frame}>
      {kind === "image" ? (
        <Image
          src={src}
          alt={props.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <iframe
          src={src}
          title={props.alt ?? ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </FadeIn>
  );
}
