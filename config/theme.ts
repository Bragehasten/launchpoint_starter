import { themes, type HeaderStyle, type ThemeMeta, type ThemeName } from "@/themes";

/**
 * PER-CLIENT THEME SELECTION — the visual counterpart of config/client.ts.
 *
 * Pick a theme; optionally override its header behavior. Client-specific
 * color tweaks go in app/globals.css (base tokens) or a small
 * `html[data-theme="..."]` override block — never in components.
 */

export const activeThemeName: ThemeName = "bold";

/** Per-client deviations from the theme's header defaults. */
const headerOverrides: Partial<HeaderStyle> = {};

// Widened to ThemeMeta: consumers branch on motion/header for ANY theme,
// so the literal types of the selected theme must not narrow comparisons.
export const activeTheme: ThemeMeta = themes[activeThemeName];

export const headerStyle: HeaderStyle = { ...activeTheme.header, ...headerOverrides };
