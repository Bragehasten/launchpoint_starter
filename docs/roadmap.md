# LaunchPoint Framework — Development Roadmap (v2)

Revised for the framework scope. Milestones 1–3 are complete and carry over unchanged.
Every milestone ends with the review → refactor → dedupe → a11y/SEO/perf pass and all
verification gates green (build, lint, typecheck, format).

## ✅ Milestone 1 — Foundation & Architecture (complete)

## ✅ Milestone 2 — UI Component & Section Library (complete)

## ✅ Milestone 3 — Supabase, Auth, Roles & Security Baseline (complete)

## Milestone 4 — Admin Dashboard Shell

Sidebar layout, breadcrumbs, command palette, server-driven data table primitives,
user management, settings pattern. **New:** admin nav is manifest-driven so capabilities
can register their own sections (foundation for §3 of the architecture doc).

## Milestone 5 — CMS Core, Blog & Section Registry

Content schema (posts, pages, categories, media via Supabase Storage), Tiptap editing,
drafts/preview/scheduled publishing, ISR revalidation. **New:** section registry with
Zod prop schemas; CMS "page" = ordered list of validated section blocks; admin
page-builder v1. Public blog with pagination, categories, authors, related posts.

## Milestone 6 — Forms & Email

Contact + newsletter (React Hook Form + Zod + server actions, honeypot + rate limit),
Resend + React Email templates, submissions stored and surfaced in admin. **New:** form
field components generalized so the quote-request capability (M10) is a configuration of
the same machinery.

## Milestone 7 — SEO & Discoverability

Metadata factory, dynamic OG images, `sitemap.ts` (config + CMS aware, excludes disabled
capabilities), `robots.ts`, redirects. **New:** JSON-LD generators including
LocalBusiness subtypes driven by module `seo.businessType` — critical for local-service
clients.

## Milestone 8 — Universal Pages & Consent

About, Services, Gallery page, Careers, Privacy/Terms/Cookie templates (content-driven,
composed from the section registry), cookie consent banner with config-driven categories.
New sections: Stats, Team, Timeline, Before/After slider, Gallery grid.

## Milestone 9 — Stripe Payments

Checkout + webhooks + payments in admin (as originally planned). **New:** deposit
pattern (percentage/fixed) as a reusable primitive for booking-heavy industries.

## Milestone 10 — Capability Layer v1

The module system core: capability manifest types, `config/client.ts` assembly,
route guards, admin auto-mounting, per-capability schema convention. First capabilities:
**team, services/price-list (menu), gallery (incl. before/after), locations & hours,
quote requests, promotions/financing content.**

## Milestone 11 — Booking & Scheduling Capability

Native provider (Supabase slots, confirmations via Resend, deposits via M9) + external
provider adapter (embed). The interface is the deliverable; native stays deliberately
simple.

## Milestone 12 — First Industry Modules

Restaurant (menu, reservations→booking, events/catering, locations, gallery) and
Barbershop (team, services, booking, pricing, gallery) as pure configuration — proving
one hospitality and one service archetype. Then Food Truck, Coffee Shop, Salon, Nail,
Tattoo, Med Spa + the trades follow as config files with demo content.

## Milestone 13 — Analytics, Error Handling & Performance Hardening

Vercel Analytics, error boundaries everywhere, loading skeletons on all dynamic routes,
LazyMotion, image/font audit, Lighthouse ≥95 documented, dependency audit, CSP.
_Done — see `docs/performance.md`. Playwright smoke tests and the Upstash rate-limit
adapter moved to M14 (both need package installs; sandbox registry access was down)._

## Milestone 14 — Documentation & Client-Clone Playbook

Architecture guide (kept current), capability/module authoring guide, "new client site
in a day" playbook, seed scripts per archetype, final end-to-end review.
_Done — `docs/playbook.md` is the deliverable. Carried-over backlog items #3 (Upstash
adapter) and #11 (Playwright smoke suite) shipped here too._

---

### Ordering rationale (v1–v2)

Admin (4) and CMS (5) come first because every capability's admin UI builds on them.
Forms (6), SEO (7), pages (8), Stripe (9) complete the universal layer. Only then does
the capability layer (10–11) land on a finished foundation, making modules (12) pure
configuration. Hardening (13) and docs (14) close it out.

---

# v3 — Themes, Local SEO, Forms Engine, AI (M15–M20)

Decisions locked: location reviews are curated manually in admin (Google Places
sync → backlog); forms are config-defined typed files (admin builder → backlog);
AI uses the Anthropic API server-side (`ANTHROPIC_API_KEY` per project); launch
themes are Luxury, Modern, Minimal, Bold, Industrial.

## Milestone 15 — Design Token Engine & Theme System

Tokens beyond color: typography scale + self-hosted font pairs, spacing, radius,
elevation/shadows, animation intensity (none/subtle/expressive), button/card/form
treatments, header layout variants (centered/split/transparent/sticky). A theme is
a named token bundle (one definition file); `config/client.ts` picks it. Five
launch themes; `/dev` theme preview across both color modes. Components never
change — they read tokens.

_Done._

## Milestone 16 — Forms Engine

One engine, many forms: a typed field-definition config generates the Zod schema,
the renderer, and the server action. Ships contact, quote, booking-request,
employment (file upload → private bucket), catering, consultation, emergency
service (louder notification path, SMS-ready seam), newsletter. Per-form email
routing + autoresponders; admin inbox filters by form kind. Existing forms
migrate onto the engine.

_Done._

## Milestone 17 — Multi-Location Capability v2

Locations gain slug, geo, map embed, per-location content, curated reviews.
`/locations/[slug]` landing pages: NAP, hours, map, reviews, embedded form,
LocalBusiness JSON-LD. Index page appears at 2+ locations; footer NAP + sitemap
wiring; staff-per-location and booking-per-location associations. Scales 1 → 30.

_Done._

## Milestone 18 — Service Areas Capability

`service_areas` → `/service-areas/[slug]` pages: area intro, services offered,
area FAQs, `areaServed` JSON-LD, sitemap, internal-link mesh. Content quality
guardrails against doorway-page penalties — unique copy per area is the rule,
enforced editorially and accelerated by M19.

_Done._

## Milestone 19 — AI Content Layer

Server-side Anthropic API, admin-only, drafts-not-publishes. Generate/rewrite
across editors: service descriptions, SEO titles + meta, FAQs, blog drafts,
testimonial summaries, social posts — prompt presets auto-fed the client's
business context from config + DB. Flagship: unique service-area page drafts
per city.

_Done._

## Milestone 20 — Preset Wizard & Playbook v2

`npm run create-client`: industry → theme → palette → nav style → writes
`config/client.ts` and theme selection, prints remaining playbook steps.
Docs refresh, final v3 review.
_Done — v3 complete. All 20 milestones shipped._

### Ordering rationale (v3)

Tokens (15) first — everything visual sits on them. Forms (16) before the local
SEO pair because location/area pages embed forms. Locations (17) before areas (18)
— they share the local-SEO plumbing, and the physical case is stricter. AI (19)
lands after areas because unique per-area copy is its highest-leverage job. The
wizard (20) ties every prior decision into the day-one experience.

---

# v4 — Bilingual (M21)

## Milestone 21 — English + Spanish

Per-client opt-in (`siteConfig.locales`). /es URL mirror via middleware
rewrite (no route moves — the app's per-request rendering makes
locale-by-header possible). Typed EN/ES dictionaries, bilingual form
definitions, generic translations table overlaying capability content with
per-field English fallback, AI batch translation in AI Studio, language
switcher, hreflang + dual sitemap.
_Done._

---

# v5 — Composable Design Engine (M22–M25)

Full specification: `docs/design-engine.md`. Four additions on the existing
architecture: a primitives layer, a shared four-axis variant vocabulary,
layout strategies as first-class props, and pattern presets + registry
metadata (docs/testing/AI triple-use). Refits are pixel-equivalent by
default; every phase ends with a /dev/sections verification gate.

## ✅ Milestone 22 — Phase A: Foundation (variants, SectionShell, core primitives, Hero+CTA refit)

## ✅ Milestone 23 — Phase B: Layout strategies + card-grid dedupe (Features/Testimonials/Team/Gallery)

## ✅ Milestone 24 — Phase C: Full section refit + personality facets + patterns/rhythms + two new themes + wizard design question

## ✅ Milestone 25 — Phase D: Registry metadata (`lib/sections/meta.ts`), catalog-driven /dev/sections, `tests/sections.spec.ts`, AI `assembleLandingPage` → draft cms_pages
