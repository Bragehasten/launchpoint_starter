# Client-Clone Playbook — New Site in a Day

The repeatable process for turning this framework into a client's
production site. Steps are ordered so nothing blocks; times assume
familiarity after the first run-through.

## Morning: infrastructure (~1 hour)

### 1. Clone and install

```bash
git clone <framework-repo> <client-slug> && cd <client-slug>
npm install && npx playwright install chromium
```

### 2. Supabase project

Create a project at supabase.com (one per client — never shared), then:

```bash
npx supabase login
npx supabase link --project-ref <ref>
npx supabase db push          # applies all migrations: auth, CMS, forms,
                              # payments, capabilities, bookings
```

Seed demo content for the client's archetype so the site looks alive
during the build-out (SQL editor → paste `supabase/seeds/<archetype>.sql`).

### 3. Environment

```bash
cp .env.example .env.local
```

Fill in order of necessity: Supabase URL + anon key (required),
`NEXT_PUBLIC_APP_URL`, then the optional tiers — Resend + `CONTACT_EMAIL`
(forms email), Stripe keys (payments/deposits), service-role key (webhook),
Upstash (shared rate limiting). Everything optional degrades gracefully,
so `npm run dev` works after just the Supabase pair.

### 4. First admin

Sign up through /sign-up, then promote in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = '<owner-email>';
```

## Midday: identity (~1 hour with the wizard)

### 5. Run the wizard

```bash
npm run create-client
```

Asks: business name → industry (all 17 modules) → design style (5 themes)
→ color palette → navigation layout/behavior. Writes `config/client.ts`,
`config/theme.ts`, the site name/description, and a palette override block
in `app/globals.css`. Safe to re-run until it feels right. Routes, nav,
admin sidebar, sitemap, and labels all follow the choices.

### 6. Fine-tuning by hand

- `config/site.ts` — production URL, nav extras, socials, header CTA,
  feature flags (the wizard only sets name + description).
- Capability deviations go in `config/client.ts` `overrides`, never in
  module files (see `docs/modules.md`).
- Deeper color work than the palette block: `docs/themes.md`.
  QA at `/dev/themes` in both color modes.
- `lib/fonts.ts` — swap Geist only if the brand demands it (self-hosted
  packages only; no runtime font CDNs).
- `public/` — favicon set + `og.png` (1200×630).

### 7. Content

In /admin: replace seeded team/services/locations/promotions with real
data, upload media, write the About/Services page content, and fill the
legal templates (business name, jurisdiction — they're templates, not
legal advice). Booking clients: confirm `weeklyHours`, `slotMinutes`, and
deposit settings in the module/overrides match reality. Pick the client's
forms in `config/forms.ts`. **AI Studio** (docs/ai.md) drafts service
descriptions, SEO metadata, FAQs, and service-area pages — feed it true
facts, review everything.

## Afternoon: launch (~2 hours)

### 8. Deploy

Vercel → import repo → add every var from `.env.local` (production
values; `NEXT_PUBLIC_APP_URL` = the real domain) → deploy → point DNS.

Stripe clients: add the production webhook endpoint
(`https://<domain>/api/webhooks/stripe`, event `checkout.session.completed`)
and put its `whsec_` in Vercel env.

### 9. Verify

```bash
npm run build && npm run test:e2e   # smoke suite against the prod build
npx lighthouse https://<domain> --view   # ≥95 across the board (docs/performance.md)
npm audit --omit=dev
```

Manual pass: submit the contact form (arrives in /admin/inbox + email),
book a slot if booking is native (confirm in /admin/bookings), run a test
deposit if Stripe is live, accept/decline the cookie banner and confirm
analytics respects the choice.

### 10. Hand over

Create the client's editor account (role `editor` — full content access,
no user management), walk them through /admin, and note the site in your
client registry with its Supabase ref and deployed commit.

## The rules that keep clones cheap

Never fork framework code for one client — that's what `overrides` and
CMS content are for. If a client needs something the framework can't
express, it goes in `docs/framework-backlog.md` and gets built once,
properly, in core. A client repo should differ from the framework in:
`config/*`, `app/globals.css`, `public/`, seeds, and nothing else.
