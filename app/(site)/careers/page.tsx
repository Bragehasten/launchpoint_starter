import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import { Cta, Hero } from "@/components/sections";
import { Container, Section } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { openings } from "@/config/careers";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description: "Join the team.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <Hero
        eyebrow="Careers"
        title="Come do your best work"
        description="We hire people who take pride in their craft and treat customers like neighbors."
      />
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
              No open positions right now — but we&apos;re always happy to hear from great people.
            </p>
          )}
        </Container>
      </Section>
      <Cta
        title="Don't see your role?"
        description="Send us a note anyway — we keep good people in mind."
        actions={[{ label: "Introduce yourself", href: "/contact" }]}
      />
    </>
  );
}
