import { ContentBlock } from "@/components/primitives/content-block";
import { CtaGroup } from "@/components/primitives/cta-group";
import { SectionShell } from "@/components/primitives/section-shell";
import type { ButtonProps } from "@/components/ui/button";
import type { SectionVariantProps } from "@/lib/design/variants";

export type CtaProps = SectionVariantProps & {
  title: string;
  description?: string;
  actions: { label: string; href: string; variant?: ButtonProps["variant"] }[];
};

/**
 * Full-width call-to-action banner, typically placed before the footer. A thin
 * assembly: a {@link SectionShell} wrapping a {@link ContentBlock} styled as an
 * inverted primary panel, with a {@link CtaGroup}. Default props reproduce the
 * previous banner markup exactly.
 *
 * @example
 *   <Cta title="Ready to start?" actions={[{ label: "Book now", href: "/book" }]} />
 */
export function Cta({
  title,
  description,
  actions,
  surface,
  density,
  background,
  backgroundImage,
}: CtaProps) {
  return (
    <SectionShell
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      <ContentBlock
        titleAs="h2"
        title={title}
        description={description}
        descriptionTone="inverted"
        align="center"
        className="bg-primary text-primary-foreground rounded-2xl px-6 py-16 sm:px-16"
        footer={<CtaGroup actions={actions} align="center" defaultVariant="secondary" />}
      />
    </SectionShell>
  );
}
