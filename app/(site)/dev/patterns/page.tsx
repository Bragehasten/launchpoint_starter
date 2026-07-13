import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PatternsPreview } from "@/components/dev/patterns-preview";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { SectionRenderer } from "@/components/shared/section-renderer";
import { getPageRhythm, getSectionPattern, type SectionBlockData } from "@/lib/design/patterns";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Pattern preview",
  robots: { index: false },
};

/** Assemble a page's blocks from a rhythm's pattern hints (pure data). */
function assemble(rhythmName: string): SectionBlockData[] {
  const rhythm = getPageRhythm(rhythmName);
  if (!rhythm) return [];
  return rhythm.sequence
    .map((step) => (step.patternHint ? getSectionPattern(step.patternHint)?.block : undefined))
    .filter((block): block is SectionBlockData => Boolean(block));
}

const DEMOS = [
  { key: "barbershop", label: "Barbershop", rhythm: "grooming-landing" },
  { key: "roofer", label: "Roofer", rhythm: "trades-landing" },
];

/**
 * Dev-only proof for Milestone C: two full pages assembled purely from
 * sectionPatterns + pageRhythms, rendered through the same validated CMS path
 * as real pages. Disabled in production.
 */
export default function PatternsPage() {
  if (env.NODE_ENV === "production") {
    notFound();
  }

  const pages = DEMOS.map((d) => ({
    ...d,
    node: <SectionRenderer blocks={assemble(d.rhythm)} />,
  }));

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Dev"
          title="Pattern preview"
          description="Two pages assembled purely from patterns. Same theme, different rhythm → different page."
        />
        <PatternsPreview pages={pages} />
      </Container>
    </Section>
  );
}
