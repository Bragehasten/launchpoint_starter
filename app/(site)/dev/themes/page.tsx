import type { Metadata } from "next";

import { ThemePreview } from "@/components/dev/theme-preview";
import { Container, Section } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Theme preview",
  robots: { index: false },
};

/**
 * Dev-only theme gallery: flips data-theme live so every token bundle can
 * be QA'd against real components in both color modes. Motion intensity and
 * header defaults are build-time (config/theme.ts) and don't switch here.
 */
export default function ThemesPage() {
  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Dev"
          title="Theme preview"
          description="Switch token bundles live. Set the real theme in config/theme.ts."
        />
        <ThemePreview />
      </Container>
    </Section>
  );
}
