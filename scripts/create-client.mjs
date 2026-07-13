#!/usr/bin/env node
/**
 * LaunchPoint client wizard — `npm run create-client`
 *
 * Interactive setup for a fresh client clone: business identity → industry
 * module → theme → color palette → navigation style. Writes:
 *   - config/client.ts   (industry module)
 *   - config/theme.ts    (theme + header overrides)
 *   - config/site.ts     (name + description, in place)
 *   - app/globals.css    (palette override block, marked + replaceable)
 *
 * Zero dependencies (node built-ins only). Industries and themes are
 * DISCOVERED from modules/ and themes/ so the wizard never drifts from the
 * framework. Re-running is safe: every write is idempotent.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

// Line queue instead of readline/promises: works interactively AND with
// piped input (where readline closes as soon as stdin drains).
const rl = createInterface({ input: stdin, output: stdout, terminal: stdin.isTTY });
const bufferedLines = [];
const waiters = [];
let stdinClosed = false;
rl.on("line", (line) => {
  const waiter = waiters.shift();
  if (waiter) waiter(line);
  else bufferedLines.push(line);
});
rl.on("close", () => {
  stdinClosed = true;
  while (waiters.length > 0) waiters.shift()("");
});

function nextLine(promptText) {
  stdout.write(promptText);
  if (bufferedLines.length > 0) return Promise.resolve(bufferedLines.shift());
  if (stdinClosed) return Promise.resolve("");
  return new Promise((resolve) => waiters.push(resolve));
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

async function discoverModules() {
  const files = (await readdir("modules")).filter(
    (f) => f.endsWith(".ts") && f !== "registry.ts" && f !== "index.ts",
  );
  const modules = [];
  for (const file of files) {
    const source = await readFile(`modules/${file}`, "utf8");
    const exportMatch = /export const (\w+): IndustryModule/.exec(source);
    const labelMatch = /label:\s*"([^"]+)"/.exec(source);
    if (exportMatch && labelMatch) {
      modules.push({
        file: file.replace(/\.ts$/, ""),
        exportName: exportMatch[1],
        label: labelMatch[1],
      });
    }
  }
  return modules.sort((a, b) => a.label.localeCompare(b.label));
}

async function discoverThemes() {
  const source = await readFile("themes/index.ts", "utf8");
  return [
    ...source.matchAll(/^  (\w+): \{\n\s+label: "([^"]+)",\n\s+description: "([^"]+)"/gm),
  ].map((m) => ({ key: m[1], label: m[2], description: m[3] }));
}

// ---------------------------------------------------------------------------
// Palettes: primary + ring override applied over any theme.
// ---------------------------------------------------------------------------

const PALETTES = {
  "theme default": null,
  blue: { light: "oklch(0.5 0.2 262)", dark: "oklch(0.66 0.2 262)", fgDark: false },
  green: { light: "oklch(0.52 0.16 155)", dark: "oklch(0.7 0.15 155)", fgDark: true },
  red: { light: "oklch(0.55 0.21 25)", dark: "oklch(0.68 0.19 25)", fgDark: false },
  orange: { light: "oklch(0.64 0.19 41)", dark: "oklch(0.72 0.17 41)", fgDark: true },
  violet: { light: "oklch(0.5 0.22 292)", dark: "oklch(0.68 0.19 292)", fgDark: false },
  black: { light: "oklch(0.2 0 0)", dark: "oklch(0.9 0 0)", fgDark: false },
};

// Brand personality → theme. A theme carries the personality facets
// (iconStyle/imagery/voice), so picking a personality picks a theme.
const PERSONALITY_TO_THEME = {
  "Clean & modern": "modern",
  "Warm & friendly": "friendly",
  "Refined & elegant": "elegant",
  Luxurious: "luxury",
  "Quiet & minimal": "minimal",
  "Bold & energetic": "bold",
  "Rugged & industrial": "industrial",
};

// ---------------------------------------------------------------------------
// Prompt helpers
// ---------------------------------------------------------------------------

async function pick(title, options, describe = (o) => o) {
  console.log(`\n${title}`);
  options.forEach((option, i) => console.log(`  ${i + 1}. ${describe(option)}`));
  for (;;) {
    const answer = (await nextLine("> ")).trim();
    const index = Number(answer) - 1;
    if (Number.isInteger(index) && options[index] !== undefined) return options[index];
    if (stdinClosed) throw new Error("No valid selection and stdin is closed.");
    console.log(`Pick a number 1–${options.length}.`);
  }
}

async function ask(question, fallback) {
  const answer = (await nextLine(`\n${question}${fallback ? ` (${fallback})` : ""}\n> `)).trim();
  return answer || fallback || "";
}

async function yesNo(question, fallback) {
  const answer = (await nextLine(`\n${question} [y/n] (${fallback ? "y" : "n"})\n> `))
    .trim()
    .toLowerCase();
  if (answer === "") return fallback;
  return answer.startsWith("y");
}

// ---------------------------------------------------------------------------
// Writers (all idempotent)
// ---------------------------------------------------------------------------

async function writeClientConfig(mod, overrides = {}) {
  const entries = Object.entries(overrides);
  const overridesLiteral =
    entries.length === 0
      ? "{}"
      : `{\n${entries
          .map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`)
          .join("\n")}\n  }`;

  const content = `import { defineClient } from "@/lib/capabilities/types";
import { ${mod.exportName} } from "@/modules/${mod.file}";

/**
 * PER-CLIENT ASSEMBLY — generated by \`npm run create-client\`.
 * Capability deviations from the module go in \`overrides\`.
 */
export const clientConfig = defineClient({
  module: ${mod.exportName},
  overrides: ${overridesLiteral},
});
`;
  await writeFile("config/client.ts", content);
}

async function writeThemeConfig(themeKey, header) {
  const overrides = [];
  if (header.layout) overrides.push(`layout: "${header.layout}"`);
  if (header.sticky !== undefined) overrides.push(`sticky: ${header.sticky}`);
  if (header.transparent !== undefined) overrides.push(`transparent: ${header.transparent}`);

  const content = `import { themes, type HeaderStyle, type ThemeMeta, type ThemeName } from "@/themes";

/**
 * PER-CLIENT THEME SELECTION — generated by \`npm run create-client\`.
 * Color tweaks live in the palette block at the end of app/globals.css.
 */

export const activeThemeName: ThemeName = "${themeKey}";

/** Per-client deviations from the theme's header defaults. */
const headerOverrides: Partial<HeaderStyle> = {${
    overrides.length > 0 ? ` ${overrides.join(", ")} ` : ""
  }};

// Widened to ThemeMeta: consumers branch on motion/header for ANY theme,
// so the literal types of the selected theme must not narrow comparisons.
export const activeTheme: ThemeMeta = themes[activeThemeName];

export const headerStyle: HeaderStyle = { ...activeTheme.header, ...headerOverrides };
`;
  await writeFile("config/theme.ts", content);
}

async function patchSiteConfig(name, description) {
  let source = await readFile("config/site.ts", "utf8");
  source = source.replace(/(\n\s*name:\s*)"[^"]*"/, `$1${JSON.stringify(name)}`);
  if (description) {
    source = source.replace(/(\n\s*description:\s*)"[^"]*"/, `$1${JSON.stringify(description)}`);
  }
  await writeFile("config/site.ts", source);
}

// Replaces the mainNav array and headerCta object in config/site.ts.
async function writeSiteNav(mainNav, headerCta) {
  let source = await readFile("config/site.ts", "utf8");
  const items = mainNav
    .map(
      (item) => `    { title: ${JSON.stringify(item.title)}, href: ${JSON.stringify(item.href)} },`,
    )
    .join("\n");
  source = source.replace(/(\n\s*mainNav:\s*)\[[\s\S]*?\n\s*\],/, `$1[\n${items}\n  ],`);
  source = source.replace(
    /(\n\s*headerCta:\s*)\{[^}]*\}/,
    `$1{ title: ${JSON.stringify(headerCta.title)}, href: ${JSON.stringify(headerCta.href)} }`,
  );
  await writeFile("config/site.ts", source);
}

// Sets or removes the bilingual flag in config/site.ts (idempotent).
async function patchSiteLocales(bilingual) {
  let source = await readFile("config/site.ts", "utf8");
  const localesLine = '  locales: ["en", "es"],';
  // Remove any existing generated line first.
  source = source.replace(/\n\s*locales: \[[^\]]*\],/, "");
  if (bilingual) {
    source = source.replace(/(export const siteConfig: SiteConfig = \{\n)/, `$1${localesLine}\n`);
  }
  await writeFile("config/site.ts", source);
}

const PALETTE_START = "/* >>> client palette (generated by create-client) */";
const PALETTE_END = "/* <<< client palette */";

async function writePalette(palette) {
  let css = await readFile("app/globals.css", "utf8");
  // Remove any previous generated block.
  const start = css.indexOf(PALETTE_START);
  if (start !== -1) {
    const end = css.indexOf(PALETTE_END);
    css = css.slice(0, start).trimEnd() + "\n" + css.slice(end + PALETTE_END.length).trimStart();
  }
  if (palette) {
    const fgLight = palette.fgDark ? "oklch(0.15 0 0)" : "oklch(0.985 0 0)";
    const fgDark = palette.fgDark ? "oklch(0.15 0 0)" : "oklch(0.985 0 0)";
    // html[data-theme] ties the theme block's specificity; appended last, it wins.
    css =
      css.trimEnd() +
      `\n\n${PALETTE_START}
html[data-theme] {
  --primary: ${palette.light};
  --primary-foreground: ${fgLight};
  --ring: ${palette.light};
}
html[data-theme].dark {
  --primary: ${palette.dark};
  --primary-foreground: ${fgDark};
  --ring: ${palette.dark};
}
${PALETTE_END}\n`;
  } else {
    css = css.trimEnd() + "\n";
  }
  await writeFile("app/globals.css", css);
}

// Barbershop comes in two flavours with different nav + enabled capabilities.
// The "Book now" pill is the CTA on both, so it is not listed in mainNav.
const BARBER_VARIANTS = {
  "Single barber": {
    mainNav: [
      { title: "Home", href: "/" },
      { title: "Services", href: "/menu" },
      { title: "About", href: "/about" },
      { title: "Gallery", href: "/gallery" },
      { title: "Contact", href: "/contact" },
    ],
    overrides: {
      team: { enabled: false },
      promotions: { enabled: false },
      locations: { enabled: false },
    },
  },
  "Full barbershop": {
    mainNav: [
      { title: "Home", href: "/" },
      { title: "Services", href: "/menu" },
      { title: "Our Barbers", href: "/team" },
      { title: "Gallery", href: "/gallery" },
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Specials", href: "/specials" },
    ],
    overrides: { locations: { enabled: false } },
  },
};
const BARBER_CTA = { title: "Book now", href: "/book" };

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

console.log("LaunchPoint — new client setup");
console.log("──────────────────────────────");

const modules = await discoverModules();
const themes = await discoverThemes();

const businessName = await ask("Business name?");
const description = await ask("One-line description? (used for SEO — enter to skip)");
const mod = await pick("What kind of business?", modules, (m) => m.label);
const barberVariant =
  mod.exportName === "barbershop"
    ? await pick("Single barber or a full barbershop?", Object.keys(BARBER_VARIANTS))
    : null;
// Personality drives the theme; fall back to a direct pick if the mapped
// theme isn't present (e.g. a theme was removed).
const personality = await pick("Brand personality?", Object.keys(PERSONALITY_TO_THEME));
const mappedThemeKey = PERSONALITY_TO_THEME[personality];
const theme =
  themes.find((t) => t.key === mappedThemeKey) ??
  (await pick("Design style?", themes, (t) => `${t.label} — ${t.description}`));
console.log(`→ ${personality} maps to the ${theme.label} theme.`);
const paletteName = await pick("Color palette?", Object.keys(PALETTES));
const layout = await pick("Navigation layout?", ["split (logo left, nav right)", "centered logo"]);
const sticky = await yesNo("Sticky header (stays pinned on scroll)?", true);
const transparent = await yesNo("Transparent header (hero starts at the very top)?", false);
const bilingual = await yesNo(
  "Serve this site in English AND Spanish? (adds the /es mirror + language switcher)",
  false,
);

const variant = barberVariant ? BARBER_VARIANTS[barberVariant] : null;

await writeClientConfig(mod, variant?.overrides ?? {});
await writeThemeConfig(theme.key, {
  layout: layout.startsWith("centered") ? "centered" : "split",
  sticky,
  transparent,
});
if (businessName) await patchSiteConfig(businessName, description || undefined);
if (variant) await writeSiteNav(variant.mainNav, BARBER_CTA);
await writePalette(PALETTES[paletteName]);
await patchSiteLocales(bilingual);

console.log(`
Done. ${businessName || "The client"} is now a ${theme.label.toLowerCase()} ${mod.label.toLowerCase()}.

Wrote: config/client.ts · config/theme.ts · config/site.ts · app/globals.css

Next (docs/playbook.md has the full runbook):
  1. npm run dev — see it
  2. /dev/themes — QA both color modes
  3. Supabase: npx supabase db push, then seed (supabase/seeds/)
  4. config/forms.ts — pick this client's forms
  5. Content in /admin (AI Studio drafts the copy)${
    bilingual
      ? '\n  6. Spanish: AI Studio → "Translate content to Spanish" after content is in'
      : ""
  }
`);

rl.close();
