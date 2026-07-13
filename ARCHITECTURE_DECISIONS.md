# Architecture Decisions — binding for the Design Engine build

Canonical spec: `docs/design-engine.md`. These decisions are SETTLED. Do not
re-litigate them; if one proves impossible, stop and surface it to Patrick.

- **ADR-1** Extend the section registry (schemas.ts / registry.tsx /
  validateBlocks); never replace it. CMS + AI safety both hang on this contract.
- **ADR-2** Variants = cva + shared Zod enums in `lib/design/variants.ts`,
  one source exported to both components and schemas. No styled-system, no
  runtime style engines, no new dependencies.
- **ADR-3** Layout strategies are discrete components with typed slots
  (`SplitLayout`, `CardGrid`…), not one polymorphic `<Layout kind>`.
- **ADR-4** Visual personality lives in THEMES only. Never add a per-section
  "style" axis (Luxury/Bold/etc.). The four axes are surface/density/align/
  emphasis — frozen; adding an axis value requires a backlog entry.
- **ADR-5** /dev/sections gallery instead of Storybook (zero deps, real
  tokens, it IS Patrick's verification gate).
- **ADR-6** Refits ship pixel-equivalent defaults. New looks are opt-in via
  props/CMS, never the new default on existing pages.
- **ADR-7** AI assembles pages through the same validated CMS contract as
  humans; output is always a DRAFT. AI code lives behind `guard()` (role +
  rate limit) in `actions/ai.ts`.
- **ADR-8** A brand is ONE object — the theme — with visual, personality
  (iconStyle/imagery/voice), and experience (motion intensity + character,
  interaction tokens) facets. Content rhythm lives in `lib/design/patterns.ts`.
  No second styling system, ever.

Framework invariants (predate the engine, absolute):

1. Per-request rendering everywhere in (site) — the CSP nonce and i18n
   middleware depend on it. No static generation, no ISR on public pages.
2. Capabilities decide WHAT renders; the engine decides HOW. Never branch a
   primitive on industry or capability.
3. Server components by default; client components only for interaction, as
   leaves, receiving resolved strings as props (dictionary funcs don't cross
   the boundary).
4. Public links use `LocalLink`; user-facing strings come from i18n
   dictionaries (en + es both, typed).
5. Tokens only — a hex value, px shadow, or font name inside a component is a
   review failure. Themes must set every color they touch in BOTH light and
   `.dark` blocks (specificity: `html[data-theme]` outranks `.dark`).
6. Zod validates every boundary: CMS blocks, server action inputs, AI output.
7. No new npm dependencies without Patrick's explicit approval (installs
   happen on his machine only).
8. Secrets are never read outside their single choke point (`lib/ai/client.ts`,
   `lib/supabase/admin.ts`); never touch `.env.local`.
