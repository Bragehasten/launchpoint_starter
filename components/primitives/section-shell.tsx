import type { CSSProperties, ReactNode } from "react";

import { BackgroundLayer } from "@/components/primitives/backgrounds";
import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { DENSITY_VAR, sectionVariants, type SectionVariantProps } from "@/lib/design/variants";
import { cn } from "@/lib/utils";

/**
 * The outermost primitive of every section: owns the surface, decorative
 * background, vertical rhythm (density), anchor id, and an optional shared
 * heading. It wraps exactly `<Section><Container>{children}</Container></Section>`,
 * so with default props its markup is byte-identical to today's sections
 * (ADR-6 pixel-equivalence). Alignment and animation entrance are owned by the
 * inner ContentBlock, not here.
 *
 * @example
 *   <SectionShell surface="muted" heading={{ title: "Features" }}>
 *     <CardGrid>…</CardGrid>
 *   </SectionShell>
 */
type SectionShellProps = Pick<
  SectionVariantProps,
  "surface" | "density" | "background" | "backgroundImage"
> & {
  /** Optional shared section heading (renders an <h2>). */
  heading?: SectionHeadingProps;
  /** Anchor target for in-page navigation. */
  id?: string;
  /** Extra classes on the <section> element. */
  className?: string;
  /** Extra classes on the inner container. */
  containerClassName?: string;
  children: ReactNode;
};

export function SectionShell({
  surface,
  density,
  background = "solid",
  backgroundImage,
  heading,
  id,
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  const hasBackground = background !== "solid";
  const densityVar = density ? DENSITY_VAR[density] : undefined;
  // CSS-var bridge: scales the section-space utility. Unset ⇒ multiplier of 1.
  const style = densityVar ? ({ "--density": densityVar } as CSSProperties) : undefined;

  if (process.env.NODE_ENV !== "production" && background === "image" && !backgroundImage) {
    console.warn('[SectionShell] background="image" needs a backgroundImage — rendering none.');
  }

  return (
    <Section
      id={id}
      className={cn(
        sectionVariants({ surface }),
        hasBackground && "relative isolate overflow-hidden",
        className,
      )}
      style={style}
    >
      {hasBackground ? (
        <BackgroundLayer background={background} backgroundImage={backgroundImage} />
      ) : null}
      <Container className={containerClassName}>
        {heading ? <SectionHeading {...heading} /> : null}
        {children}
      </Container>
    </Section>
  );
}
