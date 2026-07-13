# LaunchPoint Framework

A production-grade website framework for premium client sites. Built once,
configured per client: **17 industries ship as ~40-line config files** on
top of a shared capability layer — booking with deposit payments, menus and
price lists, teams, locations, promotions, quote requests, galleries, CMS,
auth, and an admin dashboard.

## Stack

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui ·
Supabase (Postgres + Auth + Storage, RLS everywhere) · Stripe · Resend ·
React Hook Form + Zod · Framer Motion (LazyMotion) · Playwright · Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # Supabase URL + anon key are the only hard requirements
npm run dev
```

New client? Run the wizard:

```bash
npm run create-client   # industry → theme → palette → nav, writes the config
```

Full project setup (Supabase, seeds, admin user, deploy): see
**[docs/playbook.md](docs/playbook.md)** — the "new client site in a day"
process.

## The one-line industry switch

```ts
// config/client.ts
import { hairSalon } from "@/modules/hair-salon";
export const clientConfig = defineClient({ module: hairSalon, overrides: {} });
```

Public routes, nav, admin sidebar, sitemap, and page labels all follow the
module. Client deviations go in `overrides` — framework code never forks
per client.

## Scripts

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run lint         # ESLint
npm run typecheck    # TypeScript, no emit
npm run format       # Prettier write
npm run test:e2e     # Playwright smoke suite (against a prod build)
```

## Documentation

| Doc                                                              | What it covers                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [docs/playbook.md](docs/playbook.md)                             | Clone → configured client site in a day                    |
| [docs/framework-architecture.md](docs/framework-architecture.md) | The capability/module system and why it's shaped this way  |
| [docs/modules.md](docs/modules.md)                               | Authoring industry modules; capability reference           |
| [docs/architecture.md](docs/architecture.md)                     | Folder structure and code conventions                      |
| [docs/themes.md](docs/themes.md)                                 | Theme system: tokens, five themes, authoring guide         |
| [docs/forms.md](docs/forms.md)                                   | Forms engine: definitions, uploads, emergency path         |
| [docs/locations.md](docs/locations.md)                           | Multi-location: landing pages, reviews, local SEO          |
| [docs/service-areas.md](docs/service-areas.md)                   | Coverage pages for the trades; doorway-page rules          |
| [docs/ai.md](docs/ai.md)                                         | AI Studio: presets, guardrails, area-draft flow            |
| [docs/design-engine.md](docs/design-engine.md)                   | Composable design engine: primitives, variants, layouts    |
| [docs/i18n.md](docs/i18n.md)                                     | English + Spanish: /es mirror, translations, AI translate  |
| [docs/performance.md](docs/performance.md)                       | Hardening inventory + Lighthouse procedure                 |
| [docs/roadmap.md](docs/roadmap.md)                               | The 20 milestones (v1–v3) that built this                  |
| [docs/framework-backlog.md](docs/framework-backlog.md)           | Deliberate future work — read before building anything new |
