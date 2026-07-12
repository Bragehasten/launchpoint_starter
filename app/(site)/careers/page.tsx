import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import { Cta, Hero } from "@/components/sections";
import { Container, Section } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { openings } from "@/config/careers";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description: "Join the team.",
  path: "/careers",
});

const en = {
  hero: {
    eyebrow: "Careers",
    title: "Come do your best work",
    description: "We hire people who take pride in their craft and treat customers like neighbors.",
  },
  empty: "No open positions right now — but we're always happy to hear from great people.",
  cta: {
    title: "Don't see your role?",
    description: "Send us a note anyway — we keep good people in mind.",
    action: "Introduce yourself",
  },
};

const es: typeof en = {
  hero: {
    eyebrow: "Empleos",
    title: "Ven a dar lo mejor de ti",
    description:
      "Contratamos a personas que se enorgullecen de su oficio y tratan a los clientes como vecinos.",
  },
  empty: "No hay vacantes por ahora, pero siempre nos alegra saber de buenas personas.",
  cta: {
    title: "¿No ves tu puesto?",
    description: "Escríbenos de todos modos: tenemos presente a la buena gente.",
    action: "Preséntate",
  },
};

const content = { en, es };

export default async function CareersPage() {
  const t = content[await getLocale()];

  return (
    <>
      <Hero eyebrow={t.hero.eyebrow} title={t.hero.title} description={t.hero.description} />
      <Section className="pt-0">
        <Container className="flex max-w-3xl flex-col gap-4">
          {openings.length > 0 ? (
            openings.map((job) => (
              <Card key={job.title}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge variant="secondary">{job.type}</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {job.location}
                  </p>
                  <p className="text-sm">{job.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground rounded-md border border-dashed p-12 text-center">
              {t.empty}
            </p>
          )}
        </Container>
      </Section>
      <Cta
        title={t.cta.title}
        description={t.cta.description}
        actions={[{ label: t.cta.action, href: "/contact" }]}
      />
    </>
  );
}
