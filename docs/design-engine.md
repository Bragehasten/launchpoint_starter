# LaunchPoint Design Engine — Architecture Specification

Status: AS BUILT (v5 of the framework, M22–M25). Author: framework architect.
Prime directive: evolve, don't rebuild. Everything below layers onto the
shipped v1–v4 architecture. All four milestones are implemented; Milestone D
awaits Patrick's final verification.

**Implementation status.** Milestone A (Foundation) is IMPLEMENTED, pending
Patrick's verification at `/dev/sections`:

- Engine tokens in `app/globals.css` (surfaces, gradient/scrim, interaction,
  density), all deriving from existing palette vars → today's look unchanged.
- `lib/design/variants.ts`: the four-axis vocabulary + `sectionBaseSchema`
  (single source, cva + Zod).
- Primitives (`components/primitives/`): SectionShell, ContentBlock, MediaBlock,
  CtaGroup, backgrounds, TrustStrip, StatItem — server components.
- `ThemeMeta.motion` widened to `{ intensity, character }`; easing wired through
  `lib/animations.ts` (all 5 themes set a character; tsc-exhaustive).
- Hero + Cta refit onto primitives (pixel-equivalent defaults; `/`, `/about`,
  `/contact`, `/menu` byte-identical after class-order normalisation). hero/cta
  schemas spread `sectionBaseSchema` (all fields optional → existing CMS content
  still valid).
- `/dev/sections` gallery (noindex, prod `notFound`) for theme × surface ×
  density × align × background × hero-layout QA.

Milestone B (Layouts) is IMPLEMENTED, pending Patrick's verification:

- 10 content-blind layout primitives in `components/primitives/layouts/`
  (stack, centered, split, editorial, card-grid, masonry, carousel,
  timeline-rail, sidebar, layered) + `carousel-controls.tsx` — the sole new
  client leaf (scroll-snap track, arrow-key nav, static-grid fallback under
  reduced-motion / `motion.intensity: "none"`).
- Features, Testimonials, Team, Gallery refit onto SectionShell + CardGrid
  (grid default byte-identical: `/`, `/about`, `/services`, `/gallery` diff
  clean; Team via `/dev`). Each gains opt-in layouts (carousel/masonry).
- The one CardGrid replaces six near-identical grids; Hero's split now uses
  SplitLayout. Card-grid duplication removed from the locations & service-areas
  index pages.
- Per-section `layout` enums added to schemas (all optional). `/dev/sections`
  extended with the four sections + live layout toggles.

Milestone C (Full refit + personality + patterns) is IMPLEMENTED, pending
Patrick's verification:

- Remaining sections refit onto SectionShell (+ CardGrid where applicable):
  faq, stats, timeline, pricing, logos, before-after. Defaults byte-identical
  (`/`, `/services`, etc. diff clean; only invisible Radix `useId`s shift). Each
  schema spreads `sectionBaseSchema`.
- `ThemeMeta` gains a `personality` facet (`iconStyle`, `imagery`, `voice`;
  ADR-8). `voice` feeds `BRAND_VOICE_RULES` (lib/ai/context.ts); `imagery`
  drives MediaBlock's default treatment/aspect. All themes set it (tsc-exhaustive).
- Two new themes: `themes/friendly.css` + `themes/elegant.css` (+ meta; every
  colour in light AND `.dark`), imported in globals.css and live in the
  switchers.
- `lib/design/patterns.ts`: 15 `sectionPatterns` + 6 `pageRhythms`;
  `IndustryModule.defaultRhythm` optional (barbershop → grooming-landing).
- Wizard: a "Brand personality?" question maps to a theme
  (scripts/create-client.mjs).
- `/dev/patterns`: barbershop (grooming) + roofer (trades) pages assembled
  purely from patterns, rendered through the validated CMS path (zero invalid
  blocks) — the proof that same-theme pages differ by rhythm alone.

Milestone D (Metadata + testing + AI assembly) is IMPLEMENTED, pending Patrick's
final verification:

- `lib/sections/meta.ts`: a `SectionMeta` catalog entry per registry key
  (purpose, primitives, layouts, variants, slots, status, examples). A dev-boot
  assertion in registry.tsx throws if any section lacks schema + renderer + meta.
- `/dev/sections` is now catalog-driven: every meta example renders live through
  the validated CMS path (16 examples across 13 sections, zero invalid blocks).
  `noindex` but prod-reachable (like /dev/themes) so the smoke suite can walk it.
- `tests/sections.spec.ts`: asserts every example mounts, heading order never
  skips, and a real page has exactly one h1.
- `actions/ai.ts` → `assembleLandingPage`: guard() → rhythm + pattern-shape
  few-shot prompt → extractJson → validateBlocks (reject if any invalid) →
  `savePage` (cms_pages defaults to draft; `/p/[slug]` serves only published, so
  it never auto-publishes). Surfaced in the admin AI Studio as an "Assemble a
  landing page" panel.

Still deferred (need explicit sign-off, not a silent default): the
transparent-header `first` offset, per-section `emphasis` visual treatments, and
Gallery masonry (needs intrinsic image dimensions). `iconStyle` is stored on
themes but not yet deeply consumed. V2 opportunities (Storybook, visual-
regression baselines, axe automation) remain out of scope — see the backlog.

## 1. Executive Summary

LaunchPoint today assembles websites from ~20 single-purpose sections, 8
capabilities, 17 industry modules, 5 themes, and a CMS block system. That
already prevents Hero1–Hero100 — but each section currently has **one or two
hardcoded arrangements**, so visual variety comes almost entirely from themes.

The Design Engine closes that gap with **four additions, not sixteen engines**:

1. **A primitives layer** (`components/primitives/`) — ~12 building blocks
   (SectionShell, ContentBlock, MediaBlock, CtaGroup, StatItem, RatingBadge,
   TrustStrip, Eyebrow…) that all sections are assembled from.
2. **A shared variant vocabulary** — four axes every section understands:
   `surface`, `density`, `align`, `emphasis` — defined once, consumed
   everywhere, expressed entirely through existing design tokens.
3. **Layout strategies** — `layout` becomes a first-class prop implemented by
   ~10 reusable layout primitives (split, centered, editorial, grid, masonry,
   carousel, timeline, sidebar, layered, asymmetric). A section × its layouts
   × variants × 5 themes × palettes = thousands of premium permutations from
   one codebase.
4. **Pattern presets + registry metadata** — named recipes ("luxury-split-hero
   with stats and booking widget") stored as data, and machine-readable section
   metadata that powers documentation, the /dev gallery, CMS editing, and AI
   page assembly without architectural change.

Everything else the brief names (Theme Engine, Spacing Engine, Typography
Engine, Animation Engine, Content Engine, Capability/CMS integration) **already
exists** in the framework and is assessed below; the engine consumes these
systems rather than duplicating them.

## 2. Current Architecture Assessment

### Keep exactly as-is (no changes)

- **Capability layer + industry modules** — the business-logic composition
  system. The design engine is orthogonal: capabilities decide WHAT renders,
  the engine decides HOW it looks.
- **Auth, RLS, payments, forms engine, booking, i18n, AI layer, security
  (CSP/headers/rate limiting), logging** — infrastructure, untouched.
- **Section registry contract** (Zod schema per block, validate-then-render,
  invalid blocks skipped in prod / flagged in dev). This is the exact contract
  a design engine needs; we extend its schemas, never replace it.
- **Theme system** (M15): token bundles + `[data-theme]` CSS + TS meta. This
  IS the Theme Engine the brief asks for. Typography/Spacing/Surface/Elevation
  "engines" are token namespaces inside it, not separate systems.
- **Motion system**: LazyMotion wrappers + theme intensity = the Animation
  Engine. The engine adds _placement_ opportunities, not new machinery.

### Already supports composition

- Sections receive typed content props (never fetch business data themselves).
- `SectionHeading`, `Container/Section` are proto-primitives — proof the
  pattern works; the engine generalizes it.
- CMS pages are ordered validated blocks — the Composition Engine at page
  level already exists.

### Already scales well

- One-line industry switch; one-line theme switch; per-client palette block;
  forms as config. Every "hundreds of X" axis so far has landed as data, not
  code — the engine must preserve this property.

### Future limitations (why we act now)

- **Layout is baked into sections.** Hero supports `centered|split`; Features
  is always a grid. Ten same-industry clients on the same theme look siblings.
- **Duplication is starting**: card grids exist in Features, Team,
  Testimonials, Locations, ServiceAreas with slightly different markup;
  media+text pairs in Hero and (soon) About. Classic pre-explosion signature.
- **No shared variant language**: "make this section feel airy/compact/framed"
  requires code today.
- **CMS blocks can't express arrangement**, only content.

### Technical debt to address (inside engine work, no rewrites)

- Five near-identical card-grid implementations → one `CardGrid` layout
  primitive (dedupe during Phase C refits).
- Inline hardcoded paddings/gaps in a few sections predating `section-space`.
- `components/sections/index.ts` barrel will get unwieldy → registry metadata
  becomes the single source of truth for discovery.

## 3–4. Strengths / Weaknesses (summary)

**Strengths:** config-over-code culture; token-first styling; RSC-first with
thin client leaves; validation contracts everywhere; verification-gate
discipline; docs discipline. **Weaknesses:** layout rigidity; emerging grid
duplication; no per-section variant axes; no machine-readable component
catalog; no visual regression net.

## 5–6. Design Philosophy & Guiding Principles

1. **Sections are assembled, never authored from scratch.** A section file
   should read as a paragraph of primitives.
2. **Variance is data.** New look = new prop value/preset/theme — never a new
   component file. A second component solving the same problem is a bug.
3. **Boring beats clever.** cva + tokens + React children. No runtime style
   engines, no styled-system DSL, no schema-driven mega-renderer for v1.
4. **The schema is the contract.** Anything a section can do must be
   expressible in its Zod schema, or the CMS and AI can't reach it.
5. **Server-first.** Primitives are server components; interactivity stays in
   existing client leaves (forms, carousel controls, accordion).
6. **Every phase ships visibly verifiable work** — a /dev gallery page where
   Patrick can click through permutations before approval.

## 7. High-Level System Architecture

```
tokens (globals.css + themes/*)          ← Theme/Typography/Spacing/Surface/…
   ↓ consumed by
variants (lib/design/variants.ts)        ← surface | density | align | emphasis
   ↓ consumed by
primitives (components/primitives/*)     ← SectionShell, ContentBlock, Media…
   ↓ composed by
layouts (components/primitives/layouts/*)← Split, Grid, Editorial, Carousel…
   ↓ assembled into
sections (components/sections/*)         ← thin assemblies, ~40–80 lines each
   ↓ described by
registry (lib/sections/registry + meta)  ← schema + metadata (docs/CMS/AI)
   ↓ arranged by
patterns (lib/design/patterns.ts)        ← named section recipes
   ↓ used by
pages / CMS blocks / AI Studio
```

## 8. Folder Structure (additions only)

```
components/primitives/        # building blocks (server components)
  section-shell.tsx           # Section+Container+heading+surface+background
  content-block.tsx           # eyebrow/title/body/cta arrangement
  media-block.tsx             # image|video|map|embed with aspect + treatment
  cta-group.tsx               # 1–3 actions, strategy: inline|stacked|floating
  stat-item.tsx  rating.tsx  trust-strip.tsx  price-tag.tsx  avatar-stack.tsx
  backgrounds.tsx             # solid|gradient|image|pattern|texture strategies
  layouts/
    split.tsx centered.tsx editorial.tsx card-grid.tsx masonry.tsx
    carousel.tsx timeline-rail.tsx sidebar.tsx layered.tsx stack.tsx
lib/design/
  variants.ts                 # the four axes (cva) + shared Zod enums
  patterns.ts                 # named presets (data only)
lib/sections/
  schemas.ts (extended)  registry.tsx (extended)  meta.ts (NEW: catalog)
app/(site)/dev/sections/      # permutation gallery (verification surface)
```

Naming: primitives are nouns (`MediaBlock`), layouts are strategies
(`SplitLayout`), sections stay domain names (`Hero`). Files kebab-case,
exports PascalCase — unchanged conventions.

## 9. Component Composition Model

Every section = `SectionShell` (owns surface, background, rhythm, heading,
anchor id, animation entrance) wrapping ONE layout primitive, whose slots are
filled with primitives. Example target state:

```tsx
export function Hero({ heading, media, actions, stats, layout = "split", ...variant }: HeroProps) {
  return (
    <SectionShell {...variant} background={variant.background} first>
      <SplitLayout
        ratio="6:5"
        reverse={layout === "split-reverse"}
        primary={
          <ContentBlock
            heading={heading}
            footer={<CtaGroup actions={actions} />}
            extras={stats && <TrustStrip stats={stats} />}
          />
        }
        secondary={<MediaBlock {...media} treatment="hero" />}
      />
    </SectionShell>
  );
}
```

**Composition rules:** sections never import other sections; primitives never
import sections; layouts never contain copy; only `SectionShell` may create
vertical rhythm; client components appear only as leaves.

**Per-family model** (purpose → primitives → layouts → notes). All 37 families
in the brief reduce to these primitives — that's the point:

| Family                                  | Primitives                                                                                        | Layouts                             | Notes                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Hero                                    | ContentBlock, MediaBlock, CtaGroup, TrustStrip, StatItem, optional BookingWidget/QuoteWidget slot | split, centered, editorial, layered | `first` prop handles transparent-header offset; H1 exactly once    |
| Services/Menu/Pricing                   | PriceTag, ContentBlock                                                                            | card-grid, editorial(list), sidebar | capability-fed; menu vs price-list = presentation variant (exists) |
| Testimonials/Reviews/Social proof       | Rating, AvatarStack, quote card                                                                   | card-grid, carousel, masonry        | carousel = CSS scroll-snap + tiny client controls                  |
| Team                                    | avatar card                                                                                       | card-grid, carousel                 | location-scoped variant exists                                     |
| Gallery/Projects/Before-After           | MediaBlock, BeforeAfterSlider(existing client leaf)                                               | masonry, card-grid, carousel        | lazy images, aspect from schema                                    |
| FAQ                                     | accordion (existing)                                                                              | stack, two-column                   | FAQPage JSON-LD stays automatic                                    |
| Stats/Awards/Partners/Logos             | StatItem, TrustStrip, logo row                                                                    | grid, carousel, inline strip        | one primitive family, four labels                                  |
| Timeline/Process/Events                 | TimelineRail                                                                                      | timeline(vertical/horizontal)       | dated variant covers events                                        |
| CTA/Emergency banner/Promotions/Coupons | ContentBlock, CtaGroup, Badge                                                                     | centered, split, floating(banner)   | emergency = `emphasis:critical` + form link, not a new family      |
| Locations/Service areas/Maps/Contact    | NAP block(exists), MediaBlock(map), DynamicForm                                                   | split, card-grid, sidebar           | capability pages re-assemble the same primitives                   |
| Booking/Reservations                    | slot grid (existing), BookingWidget summary card                                                  | embedded in hero/cta via slot       | native flow stays a capability, widget is its face                 |
| Header/Footer/Nav/Newsletter/Blog/Media | existing implementations                                                                          | already variant-driven (M15)        | refit to tokens/variants only where trivially cheap                |

Accessibility per family rides the primitives: SectionShell emits `<section>`

- heading hierarchy; CtaGroup enforces link-vs-button semantics; MediaBlock
  requires alt (schema-enforced); carousel gets roving tabindex + reduced-motion
  static grid fallback. CMS requirements = each family's schema lists content +
  `layout` + variant axes. Performance notes: all primitives RSC; carousel and
  before/after are the only client leaves; images always `next/image` with
  schema-supplied `sizes`.

## 10. Layout Engine

Layout primitives are **content-blind**: props are slots + geometry
(`ratio`, `columns`, `gap`, `reverse`, `sticky`), never business fields.
Supported strategies v1: stack, centered, split, editorial (asymmetric
type-led), card-grid (replaces 5 duplicates), masonry (CSS columns), sidebar,
carousel (scroll-snap), timeline-rail, layered (overlap/floating via grid
areas). Diagonal/magazine/modular land as _parameters_ of editorial/layered
(clip-path token, grid-area presets) rather than new files — added in Phase D
only if a real design calls for them (YAGNI applies to geometry too).

Tradeoff — separate layout components vs. one `<Layout kind=…>`: separate
components win (typed slots per strategy, tree-shakeable, junior-readable);
a single polymorphic Layout would need a union-prop switchboard that grows
forever. Cost: ~10 small files. Accepted.

## 11. Theme Engine

Already shipped (M15). Engine-driven extensions only:

- New tokens: `--surface-raised/-sunken/-glass`, `--overlay-scrim`,
  `--border-emphasis`, gradient stops (`--gradient-from/-to`), pattern color.
  Themes may override; defaults derive from existing palette (zero theme churn).
- Icon weight/animation intensity stay TS-side theme meta (unchanged).
- Rule reaffirmed: **no visual constants inside primitives** — a primitive
  citing a hex value or px shadow fails review.

## 12. Variant Engine

One vocabulary in `lib/design/variants.ts`, exported twice: cva variants for
components AND Zod enums for schemas (single source, can't drift):

- `surface`: default | muted | raised | outlined | glass | inverted
- `density`: compact | comfortable | spacious (scales section-space + gaps)
- `align`: start | center
- `emphasis`: default | brand | critical

Background strategy is a `SectionShell` prop, not an axis (solid | gradient |
image | pattern | video-poster). CTA strategy lives on `CtaGroup`
(single/double/inline/stacked/floating). Visual styles (Minimal/Luxury/Bold…)
are **themes**, deliberately NOT per-section variants — mixing two style
systems per page is how consistency dies; the brief's "visual style" axis is
already better served at the theme layer.

Tradeoff — global axes vs. per-section bespoke variants: global axes chosen.
Bespoke-per-section maximizes flexibility but produces 30 mini-languages;
global axes keep the CMS UI, docs, and AI prompt space tiny. Sections may add
narrow extra variants (e.g. services `presentation`) when domain-driven.

## 13. Component Registry

Extends the existing registry with `lib/sections/meta.ts`:

```ts
{ type: "hero", title, purpose, primitives: [...], layouts: [...],
  variants: {...}, slots: [...], examples: [ {label, props} ],
  since: "v5", status: "stable" | "beta" | "deprecated", replacedBy? }
```

- **Registration** = schema + renderer + meta entry (three named exports; a
  dev-mode check asserts all three exist — missing meta throws at boot in dev).
- **Discovery/docs**: /dev/sections renders the catalog FROM meta (examples
  become live previews) — documentation that cannot go stale.
- **Versioning/deprecation**: `status` + `replacedBy`; deprecated sections
  keep rendering (client pages never break) but disappear from pickers.
- **Testing**: each meta example doubles as a smoke fixture (Playwright
  renders /dev/sections and asserts every example mounts without error).

## 14. Design Token Architecture

Existing namespaces (color, radius, display type, elevation×2, section-space,
motion intensity) + engine additions (surfaces, gradients, overlay, borders,
density multipliers `--density-{compact|spacious}`). Propagation path stays:
raw var → `@theme inline` mapping → utility → primitive → section. Dark mode
via existing `.dark` blocks; future branding = the wizard palette block +
theme override, unchanged. Breakpoints/containers remain Tailwind defaults —
no token indirection without a demonstrated need (self-review §28 kills the
"breakpoint engine").

## 15. CMS Integration

- Schemas gain `layout` + variant axes via a shared `sectionBase` Zod object
  spread into every section schema — **all existing content remains valid**
  (new fields optional with defaults).
- Page assembly, ordering, validation, draft/publish: already shipped; the
  page-builder v2 (backlog #13) gets dramatically easier because variant axes
  are uniform — one "Design" fieldset works for every block.
- Reusable content: pattern presets can be inserted as pre-filled blocks
  (v1 = insert-and-edit copies; shared-reference blocks are a v2 opportunity).
- Preview/versioning: draft preview links remain backlog #15 (unchanged
  priority); localization readiness comes free (translations table overlays
  content; layout/variants are content-independent).
- Safe editing: invalid block = skipped in prod, red box in dev (existing).

## 16. Accessibility Strategy

Centralize in primitives so it's impossible to forget: landmark + heading
order (SectionShell warns in dev on skipped levels), focus-visible ring tokens
(exists), keyboard patterns owned by the three interactive leaves (accordion —
Radix; carousel — arrow keys + tabindex; before/after — slider role, exists),
`aria-hidden` decorative backgrounds, reduced-motion + motion:none render
static (exists), contrast guarded by tokens (themes QA'd in both modes),
alt text schema-required. WCAG 2.2 AA is the review bar for every phase gate.

## 17. Performance Strategy

RSC primitives (zero JS for pure-display sections); client islands unchanged
(forms, carousel controls, sliders, consent, switcher); LazyMotion split
already in place; backgrounds are CSS-first (gradient/pattern cost ~0 bytes;
image via `next/image` with priority only on `first` hero; video =
poster + lazy `<video>` behind interaction on v2). Streaming/hydration model
unchanged (per-request dynamic — required by CSP). Bundle rule: adding a
section to a page may add ~0 client JS unless it contains a declared island.

## 18–20. Developer Experience, Testing, Documentation

- **DX**: folder structure above; one way to do anything; primitives
  documented by their meta examples; `docs/design-engine.md` (this file) +
  ADR log (§27) kept current. Contribution checklist: schema + renderer +
  meta + example + gate pass.
- **Storybook**: NOT in v1 — it duplicates what /dev/sections gives us for
  free with zero dependencies (sandbox constraint, solo maintainer). Becomes a
  v2 opportunity if a second developer joins. (Tradeoff: Storybook's controls
  are nicer; /dev gallery is zero-install, uses real themes/tokens, and ships
  in the same build. Chosen: /dev gallery.)
- **Testing**: existing gates (tsc/eslint/prettier) + Playwright smoke grows a
  `sections.spec.ts` that walks /dev/sections and asserts every registered
  example renders + has exactly one h1-per-page/heading order. Visual
  regression: Playwright `toHaveScreenshot` against /dev/sections in v2
  (needs baseline discipline; deferred deliberately).
- **A11y testing**: heading-order + landmark assertions in the smoke suite
  now; axe-core integration when installs are practical (v2).

## 21. AI Readiness

The engine makes AI assembly a **data problem** (already our AI layer's
strength): registry meta = the tool catalog an LLM reads; pattern presets =
few-shot examples; Zod schemas = validators for generated blocks (invalid
output rejected exactly like human CMS input — the safety property already
exists). New AI Studio task in Phase D: "Assemble a landing page" → model
emits a block array → validated → saved as a **draft** CMS page (never
published). Theme generation = emit palette-block values (already the wizard's
format). No architectural change needed later — that's the test of readiness.

## 22. Scalability Strategy

Growth axes and their cost curves: new section = 1 thin file + schema + meta
(constant, small); new layout = 1 primitive (rare); new theme = css+meta
(existing, cheap); new industry = config (existing); new variant value =
1 line in the vocabulary (rare, deliberate). Multi-developer readiness comes
from the meta-driven catalog, composition rules (§9), ADRs, and gates — not
from process ceremony we don't need yet.

## 23. Risks & Tradeoffs

1. **Refit regressions** (biggest risk): mitigated by phase gates — refits
   must be pixel-equivalent by default (old appearance = default variant
   values), verified in /dev + live pages before approval.
2. **Variant sprawl**: axes are frozen per phase; adding an axis value
   requires a backlog entry + justification (same discipline as capabilities).
3. **Abstraction tax on juniors**: primitives named after what they show, one
   composition pattern everywhere, and sections stay readable as prose.
4. **CMS content drift**: sectionBase fields optional + defaulted; migration
   never rewrites stored blocks.
5. **Over-delivery risk of the brief itself**: see self-review (§28).

## 24–26. Incremental Plan, V1 Scope, V2 Opportunities

**Phase A — Foundation (M22).** Variant vocabulary; SectionShell + ContentBlock

- MediaBlock + CtaGroup + backgrounds; refit Hero + CTA only (pixel-equivalent
  defaults); /dev/sections v1 showing hero permutations.
  ✅ _Your verification:_ homepage/all pages unchanged; /dev/sections lets you
  click through hero surface/density/align/background/layout permutations in
  all 5 themes; gates green.

**Phase B — Layouts (M23).** Layout primitives (split, centered, editorial,
card-grid, masonry, carousel, timeline-rail, stack, sidebar, layered); refit
Features, Testimonials, Team, Gallery onto CardGrid/Carousel/Masonry (the
dedupe); schemas gain `layout`.
✅ _Verification:_ pick any of those sections in /dev, flip layouts live;
existing pages still identical by default; one CMS page block flipped to a new
layout as a live demo.

**Phase C — Full refit + patterns (M24).** Remaining sections (FAQ, Stats,
Timeline, Pricing, Logos, Contact, capability pages' internal grids);
`lib/design/patterns.ts` with ~15 named presets across industries; wizard
gains "design personality" question mapping to presets.
✅ _Verification:_ /dev/sections complete catalog; two demo pages assembled
purely from patterns (barbershop + roofer) that look meaningfully different
from each other on the same theme.

**Phase D — Registry meta + AI assembly (M25).** meta.ts for all sections;
catalog-driven /dev docs; Playwright sections smoke; AI Studio "Assemble
landing page" producing draft CMS pages; docs finalized; ADR log.
✅ _Verification:_ generate a draft landing page from AI Studio, review it in
the CMS, publish it; run the new smoke suite.

**V2 opportunities** (explicitly out of scope): Storybook, visual regression
baselines, axe automation, shared-reference CMS blocks, video backgrounds,
diagonal/magazine geometry parameters, per-section theme overrides, drag-drop
page builder v2 (backlog #13 — massively de-risked by this work).

## 27. Architecture Decision Log

- ADR-1: Extend section registry; do not replace (existing contract is
  engine-grade).
- ADR-2: Variants via cva + shared Zod enums; no styled-system/runtime DSL
  (readability, RSC-compat, zero deps).
- ADR-3: Layout strategies as discrete components, not one polymorphic Layout
  (typed slots, tree-shaking, growth isolation).
- ADR-4: Visual styles remain THEMES; per-section style mixing rejected
  (consistency is the product).
- ADR-5: /dev gallery over Storybook for v1 (zero deps, real tokens, solo dev).
- ADR-6: Pixel-equivalent defaults during refits (protects shipped sites).
- ADR-7: AI assembles through the same validated CMS contract as humans
  (safety by construction).

## 28. Critical Self-Review

Where the brief over-asks, and what I cut:

- **"16 engines" → 4 additions.** Spacing/Typography/Surface/Elevation
  "engines" are token namespaces; Content Engine is the CMS; Composition/Slot
  system is React. Naming them engines would add vocabulary, not capability.
- **37 component families → ~12 primitives + existing sections.** Emergency
  banners, coupons, awards, partners, reservations et al. are variants/presets
  of existing families. Building them as families would recreate Hero1–100 one
  level down.
- **17 layouts → 10.** Diagonal, magazine, modular, overlapping, floating
  collapse into parameters of editorial/layered. Ship geometry when a design
  demands it, not speculatively.
- **Component versioning**: full semver per component is enterprise theater at
  our scale; `status/replacedBy` gives 90% of the value at 5% of the cost.
- **What I kept despite complexity cost**: registry meta (it pays for docs,
  testing, AND AI — triple leverage), and the four-axis variant system (the
  minimum vocabulary that makes "thousands of variations" honest rather than
  marketing).
- **Assumption to challenge in Phase A**: that pixel-equivalent refits are
  achievable cheaply. If Hero's refit fights us, the fallback is refit-with-
  intentional-polish (you approve the new default look explicitly).

_Bottom line: the elegant version of this system is small. Tokens already
carry the beauty; the engine just gives them more places to stand._

## 29. Addendum — Brand Personality, Content Rhythm, Experience Layer

Three concepts proposed by Patrick, evaluated and placed:

**Brand Personality → a facet of the theme, not a second layer.** A separate
personality system would create a theme × personality QA matrix and two
competing answers to every styling question. Instead `ThemeMeta` gains
`personality` facets: `iconStyle` (stroke/fill weight), `imagery` guidance
(treatment, overlay, crop — consumed by MediaBlock defaults AND injected into
AI prompts), and `voice` adjectives feeding `BRAND_VOICE_RULES` so generated
copy matches the brand's tone. New tones (Friendly, Elegant, Corporate,
Playful, Rustic, Premium) ship as new THEMES — cheap since M15. One brand =
one theme object.

**Content Rhythm → page-level patterns.** `lib/design/patterns.ts` exports
`pageRhythms`: named, annotated section sequences per industry archetype
(e.g. trades-landing, hospitality-landing). Industry modules may declare
`defaultRhythm`. Rhythms guide the wizard, docs, and Phase-D AI assembly
(model picks a rhythm, then fills it) — pages may always deviate. Pure data.

**Experience Layer → theme facets + interaction tokens.** `ThemeMeta.motion`
becomes `{ intensity, character: "crisp" | "smooth" | "springy" }` (character
maps to easing in lib/animations); new tokens `--ease-brand`, `--hover-lift`,
`--press-scale`, link-underline treatment, overridden per theme. Page
transitions deferred to V2 (View Transitions API maturity + our per-request
rendering).

**ADR-8:** a brand is ONE object — the theme — with visual, personality, and
experience facets; rhythm lives in patterns. No second styling system, ever.

**Phase placement:** interaction tokens + motion character → Phase A;
imagery/voice facets + Friendly & Elegant themes + pageRhythms → Phase C;
AI consumption of personality + rhythm → Phase D.
