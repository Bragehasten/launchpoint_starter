import type { LucideIcon } from "lucide-react";

import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Feature = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

export type FeaturesProps = {
  heading: Omit<SectionHeadingProps, "className">;
  features: Feature[];
  /** Number of columns at desktop width. */
  columns?: 2 | 3 | 4;
};

export function Features({ heading, features, columns = 3 }: FeaturesProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger
          className={cn(
            "grid gap-6 sm:grid-cols-2",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4",
          )}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className="h-full">
                <CardHeader>
                  {feature.icon ? (
                    <div className="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-lg">
                      <feature.icon className="size-5" aria-hidden="true" />
                    </div>
                  ) : null}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
