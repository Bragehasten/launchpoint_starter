import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { SectionShell } from "@/components/primitives/section-shell";
import { StaggerItem } from "@/components/shared/motion";
import type { SectionVariantProps } from "@/lib/design/variants";

export type Stat = {
  /** Display value, e.g. "250+", "98%", "$2M". */
  value: string;
  label: string;
};

export type StatsProps = SectionVariantProps & {
  stats: Stat[];
};

/** Compact stat band — social proof by the numbers. */
export function Stats({ stats, surface, density, background, backgroundImage }: StatsProps) {
  return (
    <SectionShell
      className="py-10 sm:py-12 lg:py-16"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      <CardGrid base={2} lg={4} gap="lg" className="text-center">
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="flex flex-col gap-1">
            <span className="heading text-4xl sm:text-5xl">{stat.value}</span>
            <span className="text-muted-foreground text-sm">{stat.label}</span>
          </StaggerItem>
        ))}
      </CardGrid>
    </SectionShell>
  );
}
