import type { Metadata } from "next";

import { Cta, Hero, Stats, Team, Timeline } from "@/components/sections";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "Who we are and how we work.",
  path: "/about",
});

/** Demo content — replace per client (or convert to a CMS page). */
export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About us"
        title="Built by people who care about the details"
        description="We believe a website should be an asset, not an expense — fast, beautiful, and easy to keep current."
      />
      <Stats
        stats={[
          { value: "120+", label: "Projects delivered" },
          { value: "10 yrs", label: "In business" },
          { value: "98%", label: "Client retention" },
          { value: "4.9★", label: "Average review" },
        ]}
      />
      <Timeline
        heading={{ eyebrow: "Our process", title: "How we work" }}
        steps={[
          {
            title: "Discover",
            description:
              "We learn your business, customers, and goals before anything is designed.",
          },
          {
            title: "Design",
            description: "A design tailored to your brand — reviewed together, refined fast.",
          },
          {
            title: "Build",
            description: "Production-grade engineering with performance and SEO built in.",
          },
          {
            title: "Launch & grow",
            description: "We ship, measure, and keep improving after launch.",
          },
        ]}
      />
      <Team
        heading={{ eyebrow: "The team", title: "The people behind the work" }}
        members={[
          { name: "Patricio Bernal", role: "Founder" },
          { name: "Alex Chen", role: "Design Lead" },
          { name: "Sam Rodriguez", role: "Engineering" },
          { name: "Jordan Lee", role: "Client Success" },
        ]}
      />
      <Cta title="Want to work together?" actions={[{ label: "Get in touch", href: "/contact" }]} />
    </>
  );
}
