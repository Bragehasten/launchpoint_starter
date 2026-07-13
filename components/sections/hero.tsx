import { ContentBlock } from "@/components/primitives/content-block";
import { CtaGroup } from "@/components/primitives/cta-group";
import { SplitLayout } from "@/components/primitives/layouts/split";
import { MediaBlock } from "@/components/primitives/media-block";
import { SectionShell } from "@/components/primitives/section-shell";
import type { ButtonProps } from "@/components/ui/button";
import type { SectionVariantProps } from "@/lib/design/variants";

export type HeroAction = {
  label: string;
  href: string;
  variant?: ButtonProps["variant"];
};

export type HeroProps = SectionVariantProps & {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: HeroAction[];
  /** Optional image for the split layout. */
  image?: { src: string; alt: string };
  /** "centered" (default) or "split" with image on the right. */
  layout?: "centered" | "split";
};

/**
 * Landing hero — the page's single H1. A thin assembly: a {@link SectionShell}
 * wrapping a {@link ContentBlock} (+ {@link CtaGroup}) and, in split layout, a
 * hero {@link MediaBlock}. Default props render exactly the previous markup;
 * the surface/density/align/background axes are additive and opt-in.
 *
 * @example
 *   <Hero title="Book in seconds" actions={actions} layout="split" image={img} />
 */
export function Hero({
  eyebrow,
  title,
  description,
  actions,
  image,
  layout = "centered",
  surface,
  density,
  align,
  background,
  backgroundImage,
}: HeroProps) {
  const isSplit = layout === "split" && image;
  // Alignment follows the layout by default; the align axis can override it.
  const contentAlign = align ?? (isSplit ? "start" : "center");

  const content = (
    <ContentBlock
      titleAs="h1"
      eyebrow={eyebrow}
      title={title}
      description={description}
      align={contentAlign}
      footer={
        actions && actions.length > 0 ? (
          <CtaGroup actions={actions} align={contentAlign} />
        ) : undefined
      }
    />
  );

  return (
    <SectionShell
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      {isSplit ? (
        <SplitLayout
          primary={content}
          secondary={
            <MediaBlock
              kind="image"
              src={image.src}
              alt={image.alt}
              treatment="hero"
              priority
              delay={0.15}
            />
          }
        />
      ) : (
        content
      )}
    </SectionShell>
  );
}
