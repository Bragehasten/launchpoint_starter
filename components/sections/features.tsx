import type { LucideIcon } from "lucide-react";

import { CardGrid } from "@/components/primitives/layouts/card-grid";
import { Carousel } from "@/components/primitives/layouts/carousel";
import { SectionShell } from "@/components/primitives/section-shell";
import type { SectionHeadingProps } from "@/components/sections/section-heading";
import { StaggerItem } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectionVariantProps } from "@/lib/design/variants";

export type Feature = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

/** "grid" (default) or a horizontally scrolling "carousel". */
export type FeaturesLayout = "grid" | "carousel";

export type FeaturesProps = SectionVariantProps & {
  heading: Omit<SectionHeadingProps, "className">;
  features: Feature[];
  /** Number of columns at desktop width. */
  columns?: 2 | 3 | 4;
  layout?: FeaturesLayout;
};

/** One feature card — shared by the grid and carousel layouts. */
function FeatureCard({ feature }: { feature: Feature }) {
  return (
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
  );
}

/**
 * Feature grid — a SectionShell heading over a CardGrid of feature cards (the
 * grid default is pixel-equivalent to the previous markup), or a Carousel.
 *
 * @example
 *   <Features heading={{ title: "Why us" }} features={features} columns={3} />
 */
export function Features({
  heading,
  features,
  columns = 3,
  layout = "grid",
  surface,
  density,
  background,
  backgroundImage,
}: FeaturesProps) {
  return (
    <SectionShell
      heading={heading}
      containerClassName="flex flex-col gap-12"
      surface={surface}
      density={density}
      background={background}
      backgroundImage={backgroundImage}
    >
      {layout === "carousel" ? (
        <Carousel label={heading.title} itemWidth="md">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </Carousel>
      ) : (
        <CardGrid sm={2} lg={columns === 2 ? undefined : columns}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </CardGrid>
      )}
    </SectionShell>
  );
}
