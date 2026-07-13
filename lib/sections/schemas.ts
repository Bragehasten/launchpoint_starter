import { z } from "zod";

import { sectionBaseSchema } from "@/lib/design/variants";

/**
 * Zod schemas for every CMS-buildable section.
 *
 * These are the CONTRACT between components and content:
 * - CMS page blocks are validated against them before render
 * - the admin page editor derives its guidance from them
 * - a section refactor that breaks the schema fails loudly in CI, not
 *   silently on a client's live page
 *
 * Icons come from the CMS as string names (components can't be serialized);
 * lib/sections/icons.ts maps them to Lucide components.
 */

const heading = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  align: z.enum(["center", "left"]).optional(),
});

const action = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(["default", "secondary", "outline", "ghost", "link"]).optional(),
});

export const sectionSchemas = {
  hero: z.object({
    // Shared design-engine axes (surface/density/align/emphasis/background).
    ...sectionBaseSchema.shape,
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    actions: z.array(action).max(3).optional(),
    image: z.object({ src: z.string().min(1), alt: z.string() }).optional(),
    layout: z.enum(["centered", "split"]).optional(),
  }),

  features: z.object({
    ...sectionBaseSchema.shape,
    heading,
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    layout: z.enum(["grid", "carousel"]).optional(),
    features: z
      .array(
        z.object({
          icon: z.string().optional(),
          title: z.string().min(1),
          description: z.string().min(1),
        }),
      )
      .min(1),
  }),

  testimonials: z.object({
    ...sectionBaseSchema.shape,
    heading,
    layout: z.enum(["grid", "carousel", "masonry"]).optional(),
    testimonials: z
      .array(
        z.object({
          quote: z.string().min(1),
          author: z.string().min(1),
          role: z.string().optional(),
          avatar: z.string().optional(),
        }),
      )
      .min(1),
  }),

  pricing: z.object({
    ...sectionBaseSchema.shape,
    heading,
    tiers: z
      .array(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.string().min(1),
          period: z.string().optional(),
          features: z.array(z.string()),
          cta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
          highlighted: z.boolean().optional(),
        }),
      )
      .min(1),
  }),

  faq: z.object({
    ...sectionBaseSchema.shape,
    heading,
    items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
  }),

  cta: z.object({
    ...sectionBaseSchema.shape,
    title: z.string().min(1),
    description: z.string().optional(),
    actions: z.array(action).min(1).max(2),
  }),

  logos: z.object({
    ...sectionBaseSchema.shape,
    label: z.string().optional(),
    logos: z
      .array(
        z.object({
          src: z.string().min(1),
          alt: z.string().min(1),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      )
      .min(1),
  }),

  stats: z.object({
    ...sectionBaseSchema.shape,
    stats: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .min(2)
      .max(8),
  }),

  team: z.object({
    ...sectionBaseSchema.shape,
    heading,
    layout: z.enum(["grid", "carousel"]).optional(),
    members: z
      .array(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          image: z.string().optional(),
          bio: z.string().optional(),
        }),
      )
      .min(1),
  }),

  timeline: z.object({
    ...sectionBaseSchema.shape,
    heading,
    steps: z
      .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
      .min(2)
      .max(10),
  }),

  "before-after": z.object({
    ...sectionBaseSchema.shape,
    heading,
    items: z
      .array(
        z.object({
          before: z.string().min(1),
          after: z.string().min(1),
          alt: z.string().min(1),
          caption: z.string().optional(),
        }),
      )
      .min(1),
  }),

  gallery: z.object({
    ...sectionBaseSchema.shape,
    heading: heading.optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    layout: z.enum(["grid", "carousel"]).optional(),
    images: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })).min(1),
  }),

  /** Embeds any enabled engine form (config/forms.ts) in a CMS page. */
  form: z.object({
    heading: heading.optional(),
    form: z.string().min(1),
  }),
} as const;

export type SectionType = keyof typeof sectionSchemas;

export const sectionTypes = Object.keys(sectionSchemas) as SectionType[];

/** One block in a CMS page: a section type plus its validated props. */
export const sectionBlockSchema = z
  .object({ type: z.enum(sectionTypes as [SectionType, ...SectionType[]]) })
  .loose();

export const pageBlocksSchema = z.array(sectionBlockSchema);

export type SectionBlock = { type: SectionType; [key: string]: unknown };

/**
 * Validates raw CMS blocks. Returns only blocks that pass their section's
 * schema; invalid blocks are reported so the admin can surface them.
 */
export function validateBlocks(raw: unknown): {
  valid: { type: SectionType; props: Record<string, unknown> }[];
  errors: { index: number; message: string }[];
} {
  const valid: { type: SectionType; props: Record<string, unknown> }[] = [];
  const errors: { index: number; message: string }[] = [];

  const parsed = pageBlocksSchema.safeParse(raw);
  if (!parsed.success) {
    return { valid, errors: [{ index: -1, message: "Blocks must be an array of sections." }] };
  }

  parsed.data.forEach((block, index) => {
    const { type, ...props } = block;
    const schema = sectionSchemas[type as SectionType];
    const result = schema.safeParse(props);
    if (result.success) {
      valid.push({ type: type as SectionType, props: result.data });
    } else {
      const issue = result.error.issues[0];
      errors.push({
        index,
        message: `${type}: ${issue?.path.join(".") ?? ""} ${issue?.message ?? "invalid"}`,
      });
    }
  });

  return { valid, errors };
}
