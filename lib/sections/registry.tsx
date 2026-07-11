import type { z } from "zod";

import {
  BeforeAfter,
  Cta,
  Faq,
  Features,
  Gallery,
  Hero,
  Logos,
  Pricing,
  Stats,
  Team,
  Testimonials,
  Timeline,
} from "@/components/sections";
import { FormSection } from "@/components/forms/form-section";
import { getIcon } from "@/lib/sections/icons";
import { sectionSchemas, type SectionType } from "@/lib/sections/schemas";

/**
 * Section registry: maps section type strings to render functions.
 *
 * Each renderer receives props already validated by the section's Zod schema
 * and adapts them to the component's API (e.g. icon names → components).
 * Adding a section = component + schema + one entry here.
 */

type PropsOf<T extends SectionType> = z.infer<(typeof sectionSchemas)[T]>;

type Renderers = { [T in SectionType]: (props: PropsOf<T>) => React.ReactNode };

export const sectionRenderers: Renderers = {
  hero: (props) => <Hero {...props} />,

  features: ({ features, ...rest }) => (
    <Features
      {...rest}
      features={features.map(({ icon, ...feature }) => ({ ...feature, icon: getIcon(icon) }))}
    />
  ),

  testimonials: (props) => <Testimonials {...props} />,
  pricing: (props) => <Pricing {...props} />,
  faq: (props) => <Faq {...props} />,
  cta: (props) => <Cta {...props} />,
  logos: (props) => <Logos {...props} />,
  stats: (props) => <Stats {...props} />,
  team: (props) => <Team {...props} />,
  timeline: (props) => <Timeline {...props} />,
  "before-after": (props) => <BeforeAfter {...props} />,
  gallery: (props) => <Gallery {...props} />,
  form: (props) => <FormSection {...props} />,
};

export function renderSection(type: SectionType, props: Record<string, unknown>) {
  const renderer = sectionRenderers[type] as (p: Record<string, unknown>) => React.ReactNode;
  return renderer(props);
}
