/**
 * Theme metadata — the TypeScript half of a theme.
 *
 * A theme is two files: `themes/<name>.css` (token overrides under
 * `html[data-theme="<name>"]`) and its entry here (behavior that CSS can't
 * express: motion intensity and header defaults). `config/theme.ts` selects
 * the active theme per client.
 *
 * CSS rule worth repeating: any COLOR a theme sets in its light block must
 * also be set in its `.dark` block, because `html[data-theme]` outranks the
 * base `.dark` selector.
 */

export type MotionIntensity = "none" | "subtle" | "expressive";

/** How motion feels: easing personality applied to every entrance. */
export type MotionCharacter = "crisp" | "smooth" | "springy";

/** The experience-layer motion facet of a theme (spec §29). */
export type MotionConfig = {
  intensity: MotionIntensity;
  character: MotionCharacter;
};

export type HeaderStyle = {
  /** "split": logo left, nav right. "centered": nav left, logo center, actions right. */
  layout: "split" | "centered";
  /** Stays pinned on scroll. */
  sticky: boolean;
  /** No background — for sites whose hero starts at the very top. */
  transparent: boolean;
};

/**
 * Brand-personality facets (spec §29 / ADR-8): a brand is ONE object — the
 * theme — with visual, experience (motion), AND personality facets. Consumed
 * by MediaBlock defaults (imagery) and AI prompts (voice); iconStyle is
 * available for icon theming.
 */
export type Personality = {
  /** Icon weight guidance. Lucide is stroke-based; "fill" favours solid marks. */
  iconStyle: "stroke" | "fill";
  imagery: {
    /** Default MediaBlock treatment when a caller doesn't specify one. */
    treatment: "plain" | "framed" | "hero";
    /** Prefer a darkening scrim over imagery (for legible overlaid text). */
    overlay: boolean;
    /** Preferred crop, mapped to a MediaBlock aspect. */
    crop: "square" | "portrait" | "landscape" | "wide";
  };
  /** Tone adjectives fed into BRAND_VOICE_RULES for generated copy. */
  voice: string[];
};

export type ThemeMeta = {
  label: string;
  description: string;
  motion: MotionConfig;
  header: HeaderStyle;
  personality: Personality;
};

export const themes = {
  modern: {
    label: "Modern",
    description: "The neutral base: clean geometric sans, balanced spacing.",
    motion: { intensity: "subtle", character: "smooth" },
    header: { layout: "split", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "framed", overlay: false, crop: "landscape" },
      voice: ["clear", "direct", "modern"],
    },
  },
  luxury: {
    label: "Luxury",
    description: "Editorial serif, warm neutrals, gold ring, unhurried spacing.",
    motion: { intensity: "expressive", character: "smooth" },
    header: { layout: "centered", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "hero", overlay: true, crop: "portrait" },
      voice: ["refined", "understated", "elegant"],
    },
  },
  minimal: {
    label: "Minimal",
    description: "Quiet grayscale, borders over shadows, tighter rhythm.",
    motion: { intensity: "subtle", character: "crisp" },
    header: { layout: "split", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "plain", overlay: false, crop: "square" },
      voice: ["concise", "calm", "precise"],
    },
  },
  bold: {
    label: "Bold",
    description: "Heavy Archivo, vivid primary, decisive shadows.",
    motion: { intensity: "expressive", character: "springy" },
    header: { layout: "split", sticky: true, transparent: false },
    personality: {
      iconStyle: "fill",
      imagery: { treatment: "framed", overlay: true, crop: "wide" },
      voice: ["confident", "punchy", "energetic"],
    },
  },
  industrial: {
    label: "Industrial",
    description: "Condensed uppercase, zero radius, steel and safety orange.",
    motion: { intensity: "subtle", character: "crisp" },
    header: { layout: "split", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "framed", overlay: true, crop: "landscape" },
      voice: ["rugged", "no-nonsense", "dependable"],
    },
  },
  friendly: {
    label: "Friendly",
    description: "Rounded sans, warm accent, generous radius, upbeat spacing.",
    motion: { intensity: "expressive", character: "springy" },
    header: { layout: "split", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "framed", overlay: false, crop: "square" },
      voice: ["warm", "approachable", "upbeat"],
    },
  },
  elegant: {
    label: "Elegant",
    description: "High-contrast serif, ample whitespace, soft neutrals.",
    motion: { intensity: "expressive", character: "smooth" },
    header: { layout: "centered", sticky: true, transparent: false },
    personality: {
      iconStyle: "stroke",
      imagery: { treatment: "hero", overlay: true, crop: "portrait" },
      voice: ["graceful", "polished", "serene"],
    },
  },
} as const satisfies Record<string, ThemeMeta>;

export type ThemeName = keyof typeof themes;
