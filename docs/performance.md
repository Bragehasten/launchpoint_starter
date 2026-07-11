# Performance & Hardening

What M13 put in place, and how to verify it per client build.

## What ships by default

**JavaScript budget.** Framer Motion loads through `LazyMotion` as an async
chunk (`lib/motion-features.ts`), keeping ~25 kB out of first-load JS on
every page. Analytics adds zero bundle weight — the Vercel scripts are
injected from their first-party endpoints only after cookie consent, and
only in production. Everything else is RSC-first: client components exist
only where interaction demands them.

**Images & fonts.** All imagery goes through `next/image` (AVIF/WebP,
remote patterns locked to Supabase Storage). Fonts are self-hosted via the
`geist` package — no third-party font requests, no layout shift from FOIT.

**Error handling.** `app/error.tsx` catches route errors inside the page
chrome with a retry button; `app/global-error.tsx` is the style-free
last resort if the root layout itself throws; `app/not-found.tsx` styles
the 404 that disabled-capability routes trigger. Route groups have
streaming `loading.tsx` skeletons.

**Security.** Static headers (HSTS, nosniff, frame deny, referrer,
permissions) in `next.config.ts`. A strict nonce-based CSP with
`strict-dynamic` is applied by middleware in production
(`lib/security/csp.ts`) — the booking embed origin is derived from client
config, not hardcoded. Server code logs through `lib/log.ts` (single-line
JSON in production, indexable by Vercel log drains).

## Running Lighthouse (per client, before launch)

Sandbox builds can't run Chrome, so this is a dev-machine step:

```bash
npm run build && npm run start   # production server on :3000
npx lighthouse http://localhost:3000 --view \
  --only-categories=performance,accessibility,best-practices,seo
```

Or Chrome DevTools → Lighthouse tab against the production build (never
`next dev` — dev scores are meaningless).

**Target: ≥95 on all four categories** for the homepage, one capability
page (e.g. /menu or /book), and one blog post. If performance dips, the
usual suspects in order: an unoptimized hero image (check `priority` +
`sizes`), a client component that should be a server component, a
third-party script added outside the consent gate.

## Dependency audit

`npm audit --omit=dev` before each client launch, and `npm outdated`
quarterly. The dependency surface is deliberately small; treat any new
runtime dependency as an architecture decision, not a convenience.
