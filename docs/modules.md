# Industry Modules — Authoring Guide

A module is **~40 lines of configuration**. It contains no components, no
routes, no queries — those all live in capabilities. If you're writing JSX
or SQL inside `modules/`, stop: that logic belongs in `capabilities/` or
`components/`.

## Switching a client's industry

```ts
// config/client.ts
import { restaurant } from "@/modules/restaurant";

export const clientConfig = defineClient({
  module: restaurant,
  overrides: {
    booking: { enabled: false }, // this client takes phone reservations
    services: { label: "Dinner Menu" }, // relabel without touching code
  },
});
```

That one edit changes: public routes (404s for disabled capabilities), main
nav, admin sidebar sections, sitemap entries, and page copy (labels).

## Adding industry #19

1. `modules/<slug>.ts` — copy the closest archetype and adjust:
   - **Hospitality** (restaurant, food truck, coffee): menu presentation,
     locations, promotions.
   - **Service/booking** (barbershop, salons, tattoo, med spa): team,
     price-list, booking (with deposits where no-shows hurt).
   - **Trades** (electrician → home builder): quotes, hidden prices,
     financing promotions, project gallery.
2. Register it in `modules/registry.ts`.
3. Set `businessType` to the closest schema.org LocalBusiness subtype —
   it feeds structured data.
4. If the industry truly needs something no capability provides, add it to
   `docs/framework-backlog.md` first. Capabilities are built deliberately,
   not per-client.

## What each capability gives you

| Capability   | Public route   | Admin section       | Notes                                                      |
| ------------ | -------------- | ------------------- | ---------------------------------------------------------- |
| services     | /menu          | Services            | `presentation: "menu"` or `"price-list"`; `showPrices`     |
| team         | /team          | Team                | staff/artists/providers                                    |
| booking      | /book          | Bookings            | native slots or external embed; optional Stripe deposit    |
| locations    | /locations     | Locations           | hours, map links, primary flag                             |
| promotions   | /specials      | Promotions          | date-windowed, auto-expiring                               |
| quotes       | /quote         | Inbox (kind: quote) | the trades workhorse; custom intro                         |
| gallery      | /gallery       | Media               | albums UI on the backlog                                   |
| serviceAreas | /service-areas | Service Areas       | coverage pages for the trades; `serviceNoun` drives titles |

## Demo content

`supabase/seeds/<archetype>.sql` seeds realistic demo data so a staging
site looks alive on day one. Run in the SQL editor after migrations;
seeds are idempotent (they delete their own rows first).
