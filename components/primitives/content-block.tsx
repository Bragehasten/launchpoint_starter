import type { ReactNode } from "react";
import { cva } from "class-variance-authority";

import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import type { Align } from "@/lib/design/variants";
import { cn } from "@/lib/utils";

/**
 * The single place a section's text stack lives: eyebrow → title → description
 * → optional body → footer (actions) → extras (e.g. a TrustStrip). It is the
 * animated entrance for the stack (a FadeIn root), so Hero and Cta reproduce
 * their current markup exactly. Title size defaults from the heading level
 * (`h1` ⇒ hero scale, else section scale). Tokens only.
 *
 * @example
 *   <ContentBlock
 *     titleAs="h1"
 *     eyebrow="New"
 *     title="Book in seconds"
 *     description="…"
 *     align="center"
 *     footer={<CtaGroup actions={actions} align="center" />}
 *   />
 */
const titleVariants = cva("heading text-balance", {
  variants: {
    size: {
      hero: "max-w-2xl text-4xl sm:text-5xl lg:text-6xl",
      section: "max-w-xl text-3xl sm:text-4xl",
    },
  },
  defaultVariants: { size: "section" },
});

const descriptionVariants = cva("max-w-xl text-lg text-balance", {
  variants: {
    tone: {
      default: "text-muted-foreground",
      inverted: "text-primary-foreground/80",
    },
  },
  defaultVariants: { tone: "default" },
});

type ContentBlockProps = {
  eyebrow?: string;
  title: string;
  /** Heading element. Also picks the default title size. */
  titleAs?: "h1" | "h2" | "h3";
  /** Override the size otherwise derived from `titleAs`. */
  size?: "hero" | "section";
  description?: string;
  /** Description colour context — `inverted` for text on a primary surface. */
  descriptionTone?: "default" | "inverted";
  /** Free-form content between description and footer. */
  body?: ReactNode;
  /** Actions row (typically a CtaGroup). */
  footer?: ReactNode;
  /** Supplementary content after the footer (e.g. a TrustStrip). */
  extras?: ReactNode;
  align?: Align;
  className?: string;
};

export function ContentBlock({
  eyebrow,
  title,
  titleAs = "h2",
  size,
  description,
  descriptionTone = "default",
  body,
  footer,
  extras,
  align = "start",
  className,
}: ContentBlockProps) {
  const Title = titleAs;
  const resolvedSize = size ?? (titleAs === "h1" ? "hero" : "section");

  return (
    <FadeIn
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <Title className={titleVariants({ size: resolvedSize })}>{title}</Title>
      {description ? (
        <p className={descriptionVariants({ tone: descriptionTone })}>{description}</p>
      ) : null}
      {body}
      {footer}
      {extras}
    </FadeIn>
  );
}
