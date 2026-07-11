import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";

export type Stat = {
  /** Display value, e.g. "250+", "98%", "$2M". */
  value: string;
  label: string;
};

export type StatsProps = {
  stats: Stat[];
};

/** Compact stat band — social proof by the numbers. */
export function Stats({ stats }: StatsProps) {
  return (
    <Section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <Stagger className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="flex flex-col gap-1">
              <span className="heading text-4xl sm:text-5xl">{stat.value}</span>
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
