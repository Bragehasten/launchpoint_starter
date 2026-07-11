import Image from "next/image";
import Link from "next/link";

import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroAction = {
  label: string;
  href: string;
  variant?: ButtonProps["variant"];
};

export type HeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: HeroAction[];
  /** Optional image for the split layout. */
  image?: { src: string; alt: string };
  /** "centered" (default) or "split" with image on the right. */
  layout?: "centered" | "split";
};

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  image,
  layout = "centered",
}: HeroProps) {
  const isSplit = layout === "split" && image;

  const content = (
    <FadeIn
      className={cn(
        "flex flex-col gap-6",
        isSplit ? "items-start text-left" : "items-center text-center",
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <h1 className="heading max-w-2xl text-4xl text-balance sm:text-5xl lg:text-6xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground max-w-xl text-lg text-balance">{description}</p>
      ) : null}
      {actions && actions.length > 0 ? (
        <div className={cn("flex flex-wrap items-center gap-3", !isSplit && "justify-center")}>
          {actions.map((action) => (
            <Button key={action.href} asChild size="lg" variant={action.variant ?? "default"}>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      ) : null}
    </FadeIn>
  );

  return (
    <Section>
      <Container>
        {isSplit ? (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {content}
            <FadeIn
              delay={0.15}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </FadeIn>
          </div>
        ) : (
          content
        )}
      </Container>
    </Section>
  );
}
