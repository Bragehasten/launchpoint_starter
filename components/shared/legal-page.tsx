import { Container, Section } from "@/components/shared/container";

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

/** Prose layout shared by privacy, terms, and cookie policy. */
export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="heading text-3xl sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">Last updated: {lastUpdated}</p>
        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">{children}</div>
      </Container>
    </Section>
  );
}
