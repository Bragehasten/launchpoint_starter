# LaunchPoint Framework — Architecture

**Status:** v2 AS BUILT (capability layer shipped in M10: lib/capabilities, modules/, config/client.ts; capability admin auto-mounts; nav + sitemap are capability-aware)
**Decision owner:** Patrick · **Author:** Lead architect (Claude)

---

## 1. What changes from the original plan — and what doesn't

**Unchanged (already built, carries over untouched):**

- Design-token theming, site config system, Zod-validated env — the "rebrand surface"
- UI primitive library and marketing section library (all props-driven, nothing business-specific)
- Auth, roles, RLS, middleware protection, security headers
- All conventions in `architecture.md` (server-first, validation at the boundary, cn(), a11y)

**New architectural concepts this scope demands:**

1. **Capability layer** — shared business features that many industries reuse
2. **Industry modules** — thin, declarative bundles that configure capabilities per industry
3. **Section registry** — string-keyed section lookup so pages can be assembled from CMS data
4. **Expanded universal pages** — about, services, gallery, careers, legal, cookie consent

**The single most important decision in this document:**

> Eighteen industries do **not** mean eighteen implementations. Almost everything in the
> industry list decomposes into ~12 shared capabilities. Industry modules must be
> _configuration_, not _code_. If a module contains real business logic, that logic
> belongs in a capability.

Proof by decomposition:

| Capability (built once)             | Used by                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| Menu / price list                   | Restaurants, food trucks, coffee shops, barbers, salons, nail salons, med spas |
| Team / provider profiles            | Barbers, salons, tattoo (artists), med spas (providers), contractors           |
| Booking & appointments              | Barbers, salons, nail, tattoo, med spas, reservations (restaurants)            |
| Gallery (incl. before/after slider) | Every single industry                                                          |
| Quote / service request forms       | All trades (electricians → home builders)                                      |
| Locations & service areas           | Restaurants, coffee, food trucks (daily tracker), all trades                   |
| Financing / promotions content      | HVAC, plumbers, roofers, fences, pavers, builders                              |
| Events / catering                   | Restaurants, food trucks, coffee shops                                         |
| Portfolio / projects                | Tattoo, roofers, landscapers, pavers, contractors, builders                    |
| Memberships / plans                 | Nail salons, med spas, HVAC maintenance plans, loyalty                         |
| Emergency-service CTA               | Electricians, plumbers, HVAC                                                   |
| Reviews / testimonials              | Everyone (already built)                                                       |

A "Barbershop module" is then ~50 lines of configuration: enable `team`, `services`,
`booking`, `gallery`; label them "Barbers", "Services", "Book a chair"; pick default page
layouts. Adding industry #19 later means writing a config file, not a feature.

## 2. Folder structure

```
app/
  (marketing)/            # universal public pages: /, about, services, contact,
                          # gallery, careers, blog, legal/*
  (auth)/                 # sign-in, sign-up, reset... (exists)
  (capabilities)/         # public routes owned by capabilities: /menu, /book,
                          # /team, /projects, /locations, /quote
  admin/                  # admin dashboard (M4); capability admin pages mount here
  api/                    # webhooks (Stripe), revalidation
components/
  ui/                     # primitives (exists)
  shared/                 # app chrome & utilities (exists)
  sections/               # marketing sections (exists, grows)
capabilities/
  <name>/                 # e.g. booking/, menu/, gallery/, quotes/, team/
    index.ts              # public API of the capability (manifest + exports)
    components/           # public-facing components
    admin/                # admin CRUD components for this capability
    actions.ts            # server actions
    queries.ts            # data access (typed Supabase)
    schema.sql            # migration fragment(s)
    types.ts
modules/
  registry.ts             # all known industry modules
  restaurant.ts           # a module = declarative config (see §3)
  barbershop.ts
  ...
config/
  site.ts                 # identity, nav, feature flags (exists)
  client.ts               # NEW: per-client assembly — enabled module + overrides
lib/                      # env, auth, supabase, seo, animations... (exists)
supabase/migrations/      # numbered migrations; capability schemas land here
                          # when first enabled (see §5)
```

Rules:

- `capabilities/` may import from `components/` and `lib/`, never from `modules/` or `app/`.
- `modules/` contains **no components** — only typed configuration referencing capabilities.
- `app/` routes are thin: read config, guard, compose.

## 3. How industry modules plug in

A module is a typed, declarative manifest:

```ts
// modules/barbershop.ts
export const barbershop: IndustryModule = {
  slug: "barbershop",
  label: "Barbershop",
  capabilities: {
    team:     { enabled: true, label: "Our Barbers", path: "/team" },
    services: { enabled: true, label: "Services", pricing: "visible" },
    booking:  { enabled: true, provider: "native", depositRequired: false },
    gallery:  { enabled: true, variants: ["grid"] },
  },
  nav: [ ...items merged into siteConfig.mainNav... ],
  seo: { businessType: "Barbershop" },   // → JSON-LD LocalBusiness subtype
};
```

Per-client assembly is one line plus overrides:

```ts
// config/client.ts
export const clientConfig = defineClient({
  module: barbershop,
  overrides: { booking: { provider: "square" } },
});
```

**Routing.** Next.js routes are static at build time, so capability routes always exist
under `app/(capabilities)/` and each page guards itself:

```ts
const cap = getCapability("booking"); // reads clientConfig
if (!cap.enabled) notFound();
```

Disabled capabilities: no nav entry, excluded from sitemap, 404 on direct hit, and no
client JS shipped (Next code-splits per route; a never-visited route costs nothing).
This avoids code generation entirely — one less moving part to maintain.

**Admin.** Capabilities export an admin manifest (nav item + CRUD pages). The admin
shell renders whatever the enabled capability set provides. Adding a capability
automatically lights up its admin section.

**Database.** Each capability owns namespaced tables (`booking_appointments`,
`menu_items`, `gallery_albums`). All capability schemas ship in the repo; migrations for
a client project apply only the enabled set (documented checklist + seed script). RLS
follows the M3 pattern: public read where appropriate, role-gated writes.

## 4. Section registry (CMS-driven pages)

Today pages compose sections in code. For CMS-driven page building (M5), sections
register under string keys:

```ts
export const sectionRegistry = {
  hero: Hero, features: Features, testimonials: Testimonials, faq: Faq,
  cta: Cta, pricing: Pricing, logos: Logos, stats: Stats, team: TeamSection,
  gallery: GallerySection, "before-after": BeforeAfterSection, timeline: Timeline, ...
} satisfies Record<string, SectionComponent>;
```

Each section gets a Zod schema for its props → CMS content is validated before render,
and the admin page-builder UI is generated from the same schemas. One source of truth:
component ⇄ schema ⇄ editor.

## 5. Scalability concerns to settle now, not later

1. **Client-project strategy.** Recommendation: this repo becomes a **template repo**;
   each client site is a fresh clone (shallow fork). Pulling framework improvements into
   existing client sites is a `git merge` from upstream. A monorepo of all client sites or
   publishing the framework as npm packages are heavier models — revisit only if the
   agency grows past ~5 people. Cost of deferring: low. Cost of choosing npm packages too
   early: high (release management overhead for a solo operator).
2. **Booking is the hardest capability.** Real scheduling (staff calendars, conflicts,
   reminders, deposits) is a product in itself. Plan: capability interface from day one
   with two providers — `native` (Supabase-backed, simple slots) and `external`
   (Square/Calendly embed) — so clients who need serious scheduling get a proven tool and
   the framework isn't liable for double-bookings. Deposits (tattoo/med spa) ride on the
   Stripe milestone.
3. **Schema generality.** Resist one mega-generic "items" table. `menu_items` and
   `services` look similar but diverge (dietary tags vs. duration/staff). Distinct tables,
   shared UI patterns.
4. **Section prop drift.** The registry's Zod schemas are the contract; CI validates
   seed/CMS content against them so a section refactor can't silently break client pages.
5. **Food-truck daily location tracker** is the only near-real-time feature in the list.
   It's a `locations` capability variant (a dated schedule table), not new infrastructure.
6. **Per-module bundle weight** is a non-issue with route-level code splitting, but we
   keep the LazyMotion optimization (M13) to hold the animation cost down globally.

## 6. Framework vs. per-client work (business view)

Framework repo ships: everything above, one **demo client config** per supported
archetype, and the clone playbook. A new client engagement is then: clone → set
`config/client.ts` + tokens + fonts → apply enabled migrations → pour content in via
admin → deploy. Target: staging site on day one.

## 7. Production hardening (as built, M13–M14)

- **CSP** is nonce-based with `strict-dynamic`, generated per request in
  `middleware.ts` via `lib/security/csp.ts`, production-only. `frame-src` derives
  from the client's booking-embed config. Static headers stay in `next.config.ts`.
- **Observability**: `lib/log.ts` (scoped, single-line JSON in production) is the
  only logging path in server code, and the seam for a future error tracker.
  Analytics (Vercel, cookieless) load first-party and only after cookie consent.
- **Errors**: route boundary (`app/error.tsx`), root fallback (`app/global-error.tsx`),
  styled 404 shared with disabled-capability routes, streaming skeletons per group.
- **Rate limiting** (`lib/rate-limit.ts`): Upstash Redis fixed-window via REST
  (fetch-only, no SDK) when configured; per-instance sliding window otherwise.
  Fails open — honeypots and validation remain the hard line.
- **Smoke tests** (`tests/smoke.spec.ts`): Playwright suite asserting the public
  surface, auth redirects, and SEO endpoints against a production build. It reads
  routes from the rendered nav, so it stays valid for any industry module.
