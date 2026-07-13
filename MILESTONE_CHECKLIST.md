# Milestone Checklist — Design Engine (Opus 4.8 execution tracker)

Rule: complete EVERY item, in order, before asking Patrick to verify. Patrick
approves at /dev/sections; only then does the next milestone begin.

## Read before ANY coding

- [ ] Read docs/design-engine.md (all sections + §29 addendum)
- [ ] Read IMPLEMENTATION_PLAN.md, ARCHITECTURE_DECISIONS.md, CODING_STANDARDS.md
- [ ] Read: app/globals.css, themes/index.ts, config/theme.ts,
      lib/sections/schemas.ts, lib/sections/registry.tsx,
      components/shared/{container,motion,section-heading? (in sections/)},
      components/sections/{hero,cta,features,testimonials}.tsx
- [ ] Do NOT modify: middleware.ts, lib/security/_, lib/supabase/_, actions/*
      (except actions/ai.ts in Milestone D), supabase/migrations/_, lib/i18n/_
      (except adding dictionary keys), forms engine, capability queries

## Milestone A — Foundation

- [ ] Tokens added (globals.css) with today-identical defaults
- [ ] lib/design/variants.ts (axes + cva + sectionBaseSchema, one source)
- [ ] Primitives: SectionShell, ContentBlock, MediaBlock, CtaGroup,
      backgrounds, TrustStrip, StatItem (server components, JSDoc'd)
- [ ] ThemeMeta.motion → { intensity, character } + easing wired through
      lib/animations.ts (all existing themes updated; tsc proves exhaustive)
- [ ] Hero + Cta refit; existing pages byte-comparable (allowing class order)
- [ ] hero/cta schemas spread sectionBaseSchema (all fields optional)
- [ ] /dev/sections v1 (noindex) with theme × variant × layout switching
- [ ] HTML-diff check: /, /about, /contact, /menu before vs after
- [ ] Gates: tsc ✓ eslint(0 warnings) ✓ prettier ✓ smoke suite still green
- [ ] Docs updated (design-engine status notes) — then PATRICK VERIFIES

## Milestone B — Layouts

- [ ] 10 layout primitives (content-blind, typed slots)
- [ ] carousel-controls.tsx = only new client component; keyboard + reduced-
      motion fallback to grid verified
- [ ] Features/Testimonials/Team/Gallery refit; defaults pixel-equivalent
- [ ] Card-grid duplication removed from locations + service-areas indexes
- [ ] Schemas gain per-section layout enums
- [ ] /dev/sections extended; HTML-diff on refit pages; gates — PATRICK VERIFIES

## Milestone C — Full refit + personality + patterns

- [ ] Remaining sections refit (faq, stats, timeline, pricing, logos, contact)
- [ ] ThemeMeta personality facets (iconStyle, imagery, voice) + consumed by
      MediaBlock defaults and lib/ai/context.ts
- [ ] themes/friendly.css + themes/elegant.css (light AND .dark for every
      color touched) + meta; QA both modes in /dev/themes
- [ ] lib/design/patterns.ts: sectionPatterns (~15) + pageRhythms (~6);
      IndustryModule.defaultRhythm optional field
- [ ] Wizard personality question (extend scripts/create-client.mjs)
- [ ] Two pattern-assembled demo CMS pages (barbershop, roofer)
- [ ] Gates + docs — PATRICK VERIFIES

## Milestone D — Metadata + AI assembly

- [ ] lib/sections/meta.ts complete; dev-boot completeness assertion
- [ ] /dev/sections catalog-driven from meta examples
- [ ] tests/sections.spec.ts (every example renders; one h1; heading order)
- [ ] assembleLandingPage action: guard() → rhythm+patterns prompt →
      extractJson → validateBlocks → DRAFT cms_page (never published)
- [ ] AI Studio "Assemble landing page" panel
- [ ] Docs: design-engine → AS BUILT; README; roadmap ✅; backlog updates
- [ ] Gates — PATRICK VERIFIES

## Every-milestone review checkpoint (repeat verbatim)

1. `npx tsc --noEmit` — zero errors
2. `npx eslint . --max-warnings 0`
3. `npx prettier --write . && npx prettier --check .`
4. Playwright smoke (Patrick's machine: `npm run build && npm run test:e2e`)
5. Re-read the diff against ARCHITECTURE_DECISIONS invariants
6. Hunt duplication introduced this milestone; dedupe before handoff
7. Keyboard-walk every new interactive element; check both color modes
8. Confirm zero client-JS growth on pages without new islands
9. Update docs touched by the change
10. Tell Patrick to `rm -rf .next && npm run dev`, then hand over for
    verification with a list of exactly what to look at

## Final validation (after Milestone D)

- [ ] All existing pages render identically unless explicitly changed
- [ ] A new section can be built from primitives in <100 lines (prove with one)
- [ ] Zero duplicated grid/split implementations remain (grep audit)
- [ ] New industry = config only (unchanged); new theme = css+meta only
      (proven by friendly/elegant); new look = props/CMS only
- [ ] CMS can set layout + variants on every refit section safely (invalid
      values rejected, defaults applied)
- [ ] AI-assembled draft page passes validateBlocks and renders
- [ ] Lighthouse ≥95 maintained on / and /menu (Patrick's machine)
- [ ] es mirror unaffected (/es spot-check on refit pages)
