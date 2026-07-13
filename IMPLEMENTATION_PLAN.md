# Design Engine — Implementation Plan (handoff to Opus 4.8)

You are implementing v5 (M22–M25) of the LaunchPoint Framework. The approved
architecture is `docs/design-engine.md` (incl. §29 addendum + ADRs) — READ IT
FIRST, then `CODING_STANDARDS.md` and `ARCHITECTURE_DECISIONS.md`. Track your
progress in `MILESTONE_CHECKLIST.md`. Patrick verifies each milestone at
`/dev/sections` before you may start the next.

## Executive summary

Add four things to a working framework: (1) a primitives layer, (2) a shared
four-axis variant vocabulary + experience tokens, (3) layout strategies as
props, (4) pattern presets + page rhythms + registry metadata + AI assembly.
Refits are pixel-equivalent by default. Nothing existing may break.

## Repository analysis (verified facts — do not rediscover, do not fight)

- Next.js 15 App Router, Turbopack, React 19, TS strict + noUncheckedIndexedAccess.
- Tailwind v4: tokens in `app/globals.css` (`:root` raw vars → `@theme inline`
  → utilities incl. custom `@utility heading` and `@utility section-space`);
  themes in `themes/*.css` under `html[data-theme]` + meta in `themes/index.ts`;
  active selection in `config/theme.ts` (`activeTheme: ThemeMeta` — keep the
  widening annotation, it prevents literal-narrowing tsc errors).
- Sections: `components/sections/*` (server components, typed props), Zod
  schemas in `lib/sections/schemas.ts`, renderers in `lib/sections/registry.tsx`,
  validation via `validateBlocks` (invalid → skipped in prod, red box in dev).
- Existing proto-primitives to BUILD ON, not replace: `Container`/`Section`
  (components/shared/container.tsx), `SectionHeading`, motion wrappers
  (`Animate`/`FadeIn`/`Stagger` in components/shared/motion.tsx — LazyMotion
  `m` + strict; intensity from theme), `LocalLink` (use for ALL public links —
  i18n), `buttonVariants` (cva already a dependency via shadcn button).
- The app renders per-request (CSP nonce + i18n depend on it). NEVER add
  `generateStaticParams`-style static rendering to (site) pages.
- Known duplication you will dedupe (Milestone C): card grids in features,
  team, testimonials, locations index, service-areas index.
- Gates: `npx tsc --noEmit`, `npx eslint . --max-warnings 0`,
  `npx prettier --write .`, Playwright smoke in `tests/smoke.spec.ts`.
- No new npm dependencies. Everything needed (cva, tailwind-merge, framer,
  zod) exists.

## Database changes

NONE. The engine is entirely config/props/CSS. (AI page assembly in Milestone
D writes to the existing `cms_pages` table through existing actions.)

## Milestone A — Foundation (spec Phase A)

**Objective:** variant vocabulary, experience tokens, core primitives; refit
Hero + Cta with pixel-equivalent defaults; /dev/sections v1.
**Why:** everything else consumes these; refitting only 2 sections limits
regression surface while proving the pattern.

Create:

```
lib/design/variants.ts
components/primitives/section-shell.tsx
components/primitives/content-block.tsx
components/primitives/media-block.tsx
components/primitives/cta-group.tsx
components/primitives/backgrounds.tsx
components/primitives/trust-strip.tsx
components/primitives/stat-item.tsx
app/(site)/dev/sections/page.tsx        (+ client permutation switcher component)
```

Modify: `app/globals.css` (new tokens below), `themes/*.css` (per-theme
overrides where the theme's personality demands), `themes/index.ts`
(`motion: { intensity, character }` — update `config/theme.ts` +
`lib/animations.ts` + `components/shared/motion.tsx` consumers),
`components/sections/hero.tsx`, `components/sections/cta.tsx`,
`lib/sections/schemas.ts` (add `sectionBase` + spread into hero/cta).

New tokens (raw var → @theme mapping, same pattern as `--elevation-card`):
`--surface-raised --surface-sunken --surface-glass --overlay-scrim
--border-emphasis --gradient-from --gradient-to --ease-brand --hover-lift
--press-scale --density-compact --density-spacious`. Defaults derive from
existing palette vars so unthemed values look identical to today.

`lib/design/variants.ts` — single source, exported twice:

```ts
export const SURFACES = ["default","muted","raised","outlined","glass","inverted"] as const;
export const DENSITIES = ["compact","comfortable","spacious"] as const;
export const ALIGNS = ["start","center"] as const;
export const EMPHASES = ["default","brand","critical"] as const;
export const BACKGROUNDS = ["solid","gradient","image","pattern"] as const;
export type Surface = (typeof SURFACES)[number]; // etc.
export const sectionVariants = cva(...);          // classes per axis, tokens only
export const sectionBaseSchema = z.object({       // spread into section schemas
  surface: z.enum(SURFACES).optional(),
  density: z.enum(DENSITIES).optional(),
  align: z.enum(ALIGNS).optional(),
  emphasis: z.enum(EMPHASES).optional(),
  background: z.enum(BACKGROUNDS).optional(),
  backgroundImage: z.string().optional(),
});
export type SectionVariantProps = z.infer<typeof sectionBaseSchema>;
```

Component APIs (all server components; children-as-slots):

- `SectionShell`: props `SectionVariantProps & { heading?: SectionHeadingProps;
first?: boolean; id?: string; children }`. Renders `<Section>` + background
  layer (from backgrounds.tsx, `aria-hidden`) + `<Container>` + optional
  `SectionHeading` + children. Defaults reproduce today's `<Section><Container>`
  exactly (that's the pixel-equivalence mechanism). Owns vertical rhythm —
  density multiplies `--section-space` via inline style var.
- `ContentBlock`: `{ eyebrow?, title, titleAs?: "h1"|"h2"|"h3", description?,
body?, footer?, extras?, align? }` — the only place hero/cta text stacks live.
- `MediaBlock`: `{ kind: "image"|"map"|"embed", src, alt?, aspect?:
"video"|"square"|"portrait"|"auto", treatment?: "plain"|"framed"|"hero",
priority? }` — wraps next/image (alt required for kind image via types).
- `CtaGroup`: `{ actions: {label, href, variant?}[], strategy?:
"inline"|"stacked", align? }` — renders Button asChild + LocalLink; enforce
  max 3 actions.
- `TrustStrip` / `StatItem`: presentational rows for stats/ratings/logos.

Refit rule: `Hero`/`Cta` keep their EXISTING public prop names and defaults;
new variant props are additive/optional. Existing call sites in `app/(site)`
and CMS content must render identically with zero edits.

/dev/sections v1: server page + small client switcher (pattern-match
`components/dev/theme-preview.tsx`) letting Patrick flip hero/cta through
layout × surface × density × align × background across themes. `robots: noindex`.

Order: tokens → variants.ts → backgrounds → SectionShell → ContentBlock/
MediaBlock/CtaGroup → motion character plumbing → hero refit → cta refit →
schemas → /dev/sections. Gate per MILESTONE_CHECKLIST before proceeding.

## Milestone B — Layout strategies (spec Phase B)

**Objective:** layout primitives; refit Features, Testimonials, Team, Gallery;
`layout` in schemas. **Why:** kills the card-grid duplication at its source
and unlocks the permutation space.

Create `components/primitives/layouts/`:
`stack.tsx centered.tsx split.tsx editorial.tsx card-grid.tsx masonry.tsx
carousel.tsx timeline-rail.tsx sidebar.tsx layered.tsx` (+ `carousel-controls.tsx`
as the ONLY new client component — scroll-snap, arrow keys, roving tabindex,
reduced-motion → renders nothing and the carousel falls back to grid).

APIs are content-blind: e.g. `SplitLayout { primary, secondary, ratio?:
"1:1"|"6:5"|"2:1", reverse?, verticalAlign? }`; `CardGrid { children,
columns?: 2|3|4, flow?: "grid"|"masonry" }`; `Carousel { children,
itemWidth?: "sm"|"md"|"lg" }`. No layout accepts business fields — slots only.

Modify: `components/sections/{features,testimonials,team,gallery}.tsx`
(assemble via SectionShell + layout primitive; default layout = current look),
`lib/sections/schemas.ts` (`layout: z.enum([...]).optional()` per section —
enum values differ per section, declare per section), capability pages'
internal grids that duplicate cards (locations index, service-areas index) →
CardGrid. Extend /dev/sections with these sections + layout toggles.

## Milestone C — Full refit, personality, patterns, rhythms (spec Phase C)

**Objective:** refit remaining sections (faq, stats, timeline, pricing, logos,
contact, before-after wrapper); ThemeMeta personality facets
(`iconStyle`, `imagery`, `voice`) consumed by MediaBlock defaults + AI context
(`lib/ai/context.ts` appends voice adjectives to BRAND_VOICE_RULES); two new
themes `themes/friendly.css` + `themes/elegant.css` (+ meta; follow
docs/themes.md rules — every light color also set in .dark); create
`lib/design/patterns.ts` with `sectionPatterns` (~15 presets: `{ name, industryHint,
block: SectionBlock }`) and `pageRhythms` (~6: `{ name, industries, sequence:
{ type, intent, patternHint? }[] }`); modules get optional `defaultRhythm`
(add to `IndustryModule` type — optional, no module edits required beyond the
archetypes you demo); wizard question mapping personality→theme (extend
`scripts/create-client.mjs` discovery — it already parses themes/index.ts).
Demo: two CMS-assembled pages (barbershop + roofer) built purely from patterns.

## Milestone D — Metadata, testing, AI assembly (spec Phase D)

**Objective:** machine-readable catalog + smoke suite + AI page assembly.
Create `lib/sections/meta.ts` (`SectionMeta` per spec §13: purpose, primitives,
layouts, variants, slots, examples[], status). Dev-boot assertion: every
registry key has schema + renderer + meta (throw in dev only). /dev/sections
becomes catalog-driven (renders meta examples). Add `tests/sections.spec.ts`
(walks /dev/sections, asserts each example renders, one h1 per page, heading
order). AI: new action `assembleLandingPage` in `actions/ai.ts` — guard() →
prompt = business context + chosen rhythm + sectionPatterns as few-shot →
`extractJson` → `validateBlocks` → reject invalid → insert into `cms_pages`
via existing CMS action path as DRAFT (never published). AI Studio panel
(pattern-match TranslatePanel). Update docs: design-engine status → AS BUILT,
README row, roadmap ✅, backlog entries for anything deferred.

## Migration safety (applies to every milestone)

- Pixel-equivalence: default variant values must reproduce current markup and
  classes. Verify by diffing rendered HTML of `/`, `/about`, `/menu`,
  `/contact` before/after each refit (curl the dev server; classnames may
  reorder, structure may not).
- CMS content compatibility: all new schema fields optional with defaults;
  never rename existing fields; `validateBlocks` must accept all pre-existing
  stored blocks (test with the demo pages in the DB).
- The i18n sweep: any link you touch stays `LocalLink`; any user-facing string
  you add goes through `lib/i18n` dictionaries (both en + es — es missing key
  = tsc error, by design).
- Dev-server hygiene: after large sweeps tell Patrick to restart with
  `rm -rf .next` (HMR wedges after mass edits — this bit us in M21).
