import { cva, type VariantProps } from "class-variance-authority";
import { z } from "zod";

/**
 * The Design Engine's shared variant vocabulary — the ONE place the four
 * section axes are defined. Exported twice from this single source so they can
 * never drift: as cva variants (consumed by primitives) and as Zod enums
 * (spread into section schemas via {@link sectionBaseSchema}).
 *
 * The axes are frozen (ADR-4): adding a value requires a backlog entry. Every
 * axis default maps to ZERO added classes / no inline var, so a SectionShell
 * with default props reproduces today's markup exactly (ADR-6 pixel-equivalence).
 *
 * @example
 *   sectionVariants({ surface: "muted", align: "center" })
 *   sectionBaseSchema.parse({ surface: "raised" })
 */

export const SURFACES = ["default", "muted", "raised", "outlined", "glass", "inverted"] as const;
export const DENSITIES = ["compact", "comfortable", "spacious"] as const;
export const ALIGNS = ["start", "center"] as const;
export const EMPHASES = ["default", "brand", "critical"] as const;
export const BACKGROUNDS = ["solid", "gradient", "image", "pattern"] as const;

export type Surface = (typeof SURFACES)[number];
export type Density = (typeof DENSITIES)[number];
export type Align = (typeof ALIGNS)[number];
export type Emphasis = (typeof EMPHASES)[number];
export type Background = (typeof BACKGROUNDS)[number];

/**
 * Density → the `--density` multiplier token consumed by the `section-space`
 * utility. `comfortable` is `undefined`: SectionShell sets no inline var, so
 * the utility falls back to `var(--density, 1)` and rhythm is identical to today.
 */
export const DENSITY_VAR: Record<Density, string | undefined> = {
  compact: "var(--density-compact)",
  comfortable: undefined,
  spacious: "var(--density-spacious)",
};

/**
 * Class-based axis for the section shell: `surface` paints the container
 * background. The other three axes are structural, not shell classes:
 * `density` is an inline `--density` var, and `align` + `emphasis` are consumed
 * by ContentBlock / CtaGroup (alignment must NOT be applied at the shell too,
 * or Hero's default markup would gain a stray `text-center`). The `default`
 * surface is the empty string — the pixel-equivalence guarantee.
 */
export const sectionVariants = cva("", {
  variants: {
    surface: {
      default: "",
      muted: "bg-muted text-foreground",
      raised: "bg-surface-raised text-card-foreground",
      outlined: "border-border border-y",
      glass: "bg-surface-glass supports-[backdrop-filter]:backdrop-blur-md",
      inverted: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: { surface: "default" },
});
export type SectionVariantClasses = VariantProps<typeof sectionVariants>;

/**
 * The base Zod object spread into every section schema. All fields optional so
 * pre-existing CMS content stays valid; enums come from the const arrays above
 * (never retyped by hand — CODING_STANDARDS).
 */
export const sectionBaseSchema = z.object({
  surface: z.enum(SURFACES).optional(),
  density: z.enum(DENSITIES).optional(),
  align: z.enum(ALIGNS).optional(),
  emphasis: z.enum(EMPHASES).optional(),
  background: z.enum(BACKGROUNDS).optional(),
  backgroundImage: z.string().optional(),
});
export type SectionVariantProps = z.infer<typeof sectionBaseSchema>;
