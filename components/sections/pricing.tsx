import { Check } from "lucide-react";
import { LocalLink as Link } from "@/components/shared/local-link";

import { Container, Section } from "@/components/shared/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeading, type SectionHeadingProps } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PricingTier = {
  name: string;
  description?: string;
  /** Display price, e.g. "$49" or "Custom". */
  price: string;
  /** e.g. "/month". Omit for one-time or custom pricing. */
  period?: string;
  features: string[];
  cta: { label: string; href: string };
  /** Visually emphasize this tier. */
  highlighted?: boolean;
};

export type PricingProps = {
  heading: Omit<SectionHeadingProps, "className">;
  tiers: PricingTier[];
  /** Label on the badge over the highlighted tier. */
  popularLabel?: string;
};

export function Pricing({ heading, tiers, popularLabel = "Most popular" }: PricingProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading {...heading} />
        <Stagger className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <Card
                className={cn(
                  "relative flex h-full flex-col",
                  tier.highlighted && "border-primary shadow-md",
                )}
              >
                {tier.highlighted ? (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{popularLabel}</Badge>
                ) : null}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.description ? <CardDescription>{tier.description}</CardDescription> : null}
                  <p className="mt-2">
                    <span className="heading text-4xl">{tier.price}</span>
                    {tier.period ? (
                      <span className="text-muted-foreground text-sm">{tier.period}</span>
                    ) : null}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    <Link href={tier.cta.href}>{tier.cta.label}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
