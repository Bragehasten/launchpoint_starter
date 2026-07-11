import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";

export type TimelineStep = {
  title: string;
  description: string;
};

export type TimelineProps = {
  heading: Omit<SectionHeadingProps, "className">;
  steps: TimelineStep[];
};

/**
 * Numbered process timeline — "how we work" for contractors, builders,
 * and any service business that sells a process.
 */
export function Timeline({ heading, steps }: TimelineProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger className="mx-auto flex w-full max-w-2xl flex-col">
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <StaggerItem key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="bg-border absolute top-10 left-5 h-full w-px"
                  />
                ) : null}
                <span className="bg-primary text-primary-foreground z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1 pt-1.5">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>
      </Container>
    </Section>
  );
}
