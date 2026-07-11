# Service Areas

For businesses that travel to the customer: one office, many cities. A
roofer in Stuart serving Palm Beach, Jupiter, and Port St. Lucie gets a
dedicated, crawlable page per city — the trades' primary local-SEO surface.

**Locations vs. service areas:** a location is a physical place customers
visit (NAP, hours, map — see docs/locations.md). A service area is a
coverage claim. Trades modules typically enable ONE location (the office,
for NAP consistency) plus many service areas.

## What each area page gets

`/service-areas/<slug>` renders "**{serviceNoun} in {name}, {region}**" as
the H1 (the module's `serviceNoun` — "Roofing", "HVAC Service" — drives
title and metadata), the area's unique intro and body copy, the service
list, area-specific FAQs (accordion + FAQPage JSON-LD), a quote form, and
an "Also serving" link mesh to every other area. Structured data is a
schema.org **Service** with `areaServed: City` and the business as
provider. All area pages ride the sitemap at 0.8.

## The doorway-page rule (read this)

Google explicitly devalues near-duplicate pages that only swap city names.
The framework enforces what it can — the intro field requires 40+
characters and the admin UI says why — but the real rule is editorial:
**every area's copy must say something true and specific about that area.**
Common jobs there, housing stock, neighborhoods, response times, permitting
quirks. See `supabase/seeds/roofer.sql` for five worked examples. M19's AI
layer drafts this per-area copy so doing it right is cheap.

## Enabling

All nine trades modules ship with it on (`serviceAreas` capability +
"Service Areas" nav). For any other industry:

```ts
// config/client.ts overrides
serviceAreas: { enabled: true, serviceNoun: "Catering" },
```

Manage areas in Admin → Service Areas (name, region, slug, intro, body,
FAQs as JSON, visibility, order).
