import { LocalLink as Link } from "@/components/shared/local-link";

import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { Button, type ButtonProps } from "@/components/ui/button";

export type CtaProps = {
  title: string;
  description?: string;
  actions: { label: string; href: string; variant?: ButtonProps["variant"] }[];
};

/** Full-width call-to-action banner, typically placed before the footer. */
export function Cta({ title, description, actions }: CtaProps) {
  return (
    <Section>
      <Container>
        <FadeIn className="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-2xl px-6 py-16 text-center sm:px-16">
          <h2 className="heading max-w-xl text-3xl text-balance sm:text-4xl">{title}</h2>
          {description ? (
            <p className="text-primary-foreground/80 max-w-xl text-lg text-balance">
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions.map((action) => (
              <Button key={action.href} asChild size="lg" variant={action.variant ?? "secondary"}>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
