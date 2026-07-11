# Multi-Location

The locations capability scales from one shop to thirty branches. Each
location is a full local-SEO unit: its own landing page, LocalBusiness
entity, map, hours, curated reviews, and staff list.

## What each location gets

`/locations/<slug>` renders NAP (name/address/phone), hours, a Google Maps
embed, curated reviews with star ratings, team members assigned to that
location, a contact form, and per-location **LocalBusiness JSON-LD** with
geo coordinates and aggregateRating derived from the reviews. Location
pages ride the sitemap at high priority.

## Behavior by location count

- **1 location**: `/locations` redirects straight to its landing page; the
  footer shows its NAP sitewide (consistent NAP = core local-SEO signal).
- **2+ locations**: `/locations` is an index of cards linking to each page;
  the footer shows the primary location plus an "All N locations" link.

## Admin

Admin → Locations manages both locations (slug, address parts, intro copy,
hours, map link + embed URL, coordinates, primary flag) and their reviews
(author, rating, body, source, published). Reviews are **curated manually**
— paste the ones worth showing. Live Google Places sync is backlog #21.

Write a unique `intro` for every location. Identical copy with swapped
city names is how multi-location SEO gets ignored; the AI layer (M19) will
draft unique copy per location to make this cheap.

## Associations

`team_members.location_id` scopes staff to a branch (null = works
everywhere) — location pages show the right people automatically.
`bookings.location_id` exists for per-branch booking scoping; the booking
UI currently books against the primary calendar (per-branch calendars go on
the backlog with demand).

## Getting map values

Google Maps → search the address → Share → "Embed a map" → copy the iframe
`src` into **Map embed URL**. Coordinates: right-click the pin → copy
lat/lng. The embed URL is allowed by the CSP's frame-src via config.
