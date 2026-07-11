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

export type HeaderStyle = {
  /** "split": logo left, nav right. "centered": nav left, logo center, actions right. */
  layout: "split" | "centered";
  /** Stays pinned on scroll. */
  sticky: boolean;
  /** No background — for sites whose hero starts at the very top. */
  transparent: boolean;
};

export type ThemeMeta = {
  label: string;
  description: string;
  motion: MotionIntensity;
  header: HeaderStyle;
};

export const themes = {
  modern: {
    label: "Modern",
    description: "The neutral base: clean geometric sans, balanced spacing.",
    motion: "subtle",
    header: { layout: "split", sticky: true, transparent: false },
  },
  luxury: {
    label: "Luxury",
    description: "Editorial serif, warm neutrals, gold ring, unhurried spacing.",
    motion: "expressive",
    header: { layout: "centered", sticky: true, transparent: false },
  },
  minimal: {
    label: "Minimal",
    description: "Quiet grayscale, borders over shadows, tighter rhythm.",
    motion: "subtle",
    header: { layout: "split", sticky: true, transparent: false },
  },
  bold: {
    label: "Bold",
    description: "Heavy Archivo, vivid primary, decisive shadows.",
    motion: "expressive",
    header: { layout: "split", sticky: true, transparent: false },
  },
  industrial: {
    label: "Industrial",
    description: "Condensed uppercase, zero radius, steel and safety orange.",
    motion: "subtle",
    header: { layout: "split", sticky: true, transparent: false },
  },
} as const satisfies Record<string, ThemeMeta>;

export type ThemeName = keyof typeof themes;
