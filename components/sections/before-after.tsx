import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { SectionShell } from "@/components/primitives/section-shell";
import { type SectionHeadingProps } from "@/components/sections/section-heading";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { StaggerItem } from "@/components/shared/motion";
import type { SectionVariantProps } from "@/lib/design/variants";

export type BeforeAfterItem = {
  before: string;
  after: string;
  /** What the comparison shows, e.g. "Kitchen renovation". */
  alt: string;
  caption?: string;
};

export type BeforeAfterProps = SectionVariantProps & {
  heading: Omit<SectionHeadingProps, "className">;
  items: BeforeAfterItem[];
};

/** Before/after gallery — roofers, salons, med spas, landscapers. */
export function BeforeAfter({
  heading,
  items,
  surface,
  density,
  background,
  backgroundImage,
}: BeforeAfterProps) {
  return (
    <SectionShell
      heading={heading}
      containerClassName="flex flex-col gap-12"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      <CardGrid lg={2} gap="lg">
        {items.map((item) => (
          <StaggerItem key={item.alt} className="flex flex-col gap-2">
            <BeforeAfterSlider before={item.before} after={item.after} alt={item.alt} />
            {item.caption ? (
              <p className="text-muted-foreground text-center text-sm">{item.caption}</p>
            ) : null}
          </StaggerItem>
        ))}
      </CardGrid>
    </SectionShell>
  );
}
