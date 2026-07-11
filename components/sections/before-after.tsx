import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";

export type BeforeAfterItem = {
  before: string;
  after: string;
  /** What the comparison shows, e.g. "Kitchen renovation". */
  alt: string;
  caption?: string;
};

export type BeforeAfterProps = {
  heading: Omit<SectionHeadingProps, "className">;
  items: BeforeAfterItem[];
};

/** Before/after gallery — roofers, salons, med spas, landscapers. */
export function BeforeAfter({ heading, items }: BeforeAfterProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger className="grid gap-8 lg:grid-cols-2">
          {items.map((item) => (
            <StaggerItem key={item.alt} className="flex flex-col gap-2">
              <BeforeAfterSlider before={item.before} after={item.after} alt={item.alt} />
              {item.caption ? (
                <p className="text-muted-foreground text-center text-sm">{item.caption}</p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
