# Coding Standards — LaunchPoint (engineering handbook for the engine build)

## Files & naming

- Files kebab-case; exports PascalCase (components) / camelCase (functions).
- Primitives are nouns (`MediaBlock`); layouts are strategies (`SplitLayout`);
  sections keep domain names (`Hero`). One component per file.
- New code goes in the folders declared in IMPLEMENTATION_PLAN — do not invent
  parallel folders (no `components/design-engine/`; the plan's paths are final).

## Components

- Server component unless it needs state/effects/events; then `"use client"`,
  kept as a leaf, props fully serializable.
- Create a new component ONLY when no primitive/variant/layout combination can
  express the need — and then propose it in the milestone notes first.
  Duplicating an existing solution is a defect, not a style choice.
- Slots are React children/named ReactNode props. No render-prop cleverness.
- Every component: JSDoc block stating purpose + one composition example.
- Variants via cva consuming `lib/design/variants.ts`; classes merged with
  `cn()`; Tailwind utilities only — no inline styles except CSS-var bridges
  (e.g. `style={{ "--section-space": … }}`).

## Themes & tokens

- New visual knobs = raw var in `:root` (globals.css) + `@theme inline`
  mapping + optional per-theme override. Default values must derive from
  existing tokens so today's look is unchanged.
- Never read theme values in JS except via `themes/index.ts` meta.

## CMS schemas

- Extend via `sectionBaseSchema` spread; all new fields `.optional()` with
  renderer-side defaults. Never rename/remove existing fields. Enums come from
  variants.ts constants — never retype string unions by hand.

## Animation

- Only through `Animate/FadeIn/Stagger/StaggerItem` wrappers. Respect theme
  intensity (`none` renders static) and prefers-reduced-motion (both already
  wired — do not bypass). Easing reads `--ease-brand` / motion character.
  Animate opacity/transform only; never layout properties.

## Accessibility

- Semantic landmarks; exactly one h1 per page; SectionShell headings follow
  document order (dev warning on skips). Icons `aria-hidden` with text
  alternatives. Interactive = real `<button>`/`<a>` (Button asChild + LocalLink).
  Keyboard support is part of the definition of done for any client leaf.
  Focus styles come from the ring tokens — never remove outlines.

## Error/loading/empty states

- Sections render `null` for empty optional collections; capability pages keep
  their "add content in Admin" empty states. Never throw for missing optional
  content. Server actions return `{ success, message }` unions — no exceptions
  across the wire.

## i18n

- Public strings: `getDict()` server-side; add keys to BOTH en.ts and es.ts
  (missing es key fails tsc — intended). Links: `LocalLink`. Admin stays
  English.

## Process

- Work in small commits per component; run gates (tsc, eslint --max-warnings 0,
  prettier) before every checkpoint; never proceed past a failing gate.
- Follow prettier output — don't hand-format against it.
- Update `docs/` in the same milestone as the code (stale docs fail review).
- When Patrick's other sessions have modified files since your last read,
  re-read before editing (system notes tell you).

## Common mistakes to avoid (learned in this repo)

- Passing functions/dictionary entries from server → client components
  (serialization error; resolve strings server-side).
- Forgetting the `.dark` counterpart for any theme color (light value leaks
  into dark mode via specificity).
- Using `next/link` directly in public components (breaks /es persistence).
- Adding `export const metadata` to pages that need locale (use
  `generateMetadata` if it must localize).
- Widening/narrowing: `themes[activeThemeName]` must stay annotated
  `: ThemeMeta` or literal types break comparisons.
- Editing `supabase/migrations/*` that already shipped — new changes = new
  numbered migration.
- Mass HMR wedging the dev server — after big sweeps, have Patrick
  `rm -rf .next && npm run dev` before judging breakage.
