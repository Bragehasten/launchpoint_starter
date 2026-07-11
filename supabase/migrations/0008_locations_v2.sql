-- =============================================================
-- 0008: multi-location v2 — landing pages, reviews, associations
-- =============================================================
-- Locations become first-class local-SEO pages: each gets a slug
-- (/locations/<slug>), optional geo coordinates for LocalBusiness JSON-LD,
-- an embeddable map, and intro copy. Curated reviews are per-location.
-- Staff and bookings can be associated with a location, which is what makes
-- a 30-location business manageable.

-- Locations v2 columns -------------------------------------------------------

alter table public.locations
  add column if not exists slug text,
  add column if not exists intro text,
  add column if not exists map_embed_url text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists city text,
  add column if not exists region text,
  add column if not exists postal_code text;

-- Backfill slugs from names, then enforce uniqueness.
update public.locations
set slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where slug is null;

alter table public.locations alter column slug set not null;
create unique index if not exists locations_slug_idx on public.locations (slug);

-- Curated reviews per location ----------------------------------------------

create table public.location_reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  -- Where the review came from: 'google', 'yelp', 'facebook', 'direct'...
  source text not null default 'google',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index location_reviews_location_idx
  on public.location_reviews (location_id, published, sort_order);

alter table public.location_reviews enable row level security;

create policy "Public read published reviews" on public.location_reviews
  for select using (published = true or public.is_editor());
create policy "Editors insert reviews" on public.location_reviews
  for insert with check (public.is_editor());
create policy "Editors update reviews" on public.location_reviews
  for update using (public.is_editor());
create policy "Editors delete reviews" on public.location_reviews
  for delete using (public.is_editor());

-- Associations ----------------------------------------------------------------
-- Nullable on purpose: single-location businesses never set these, and
-- "works at all locations" is expressed as null.

alter table public.team_members
  add column if not exists location_id uuid references public.locations (id) on delete set null;

alter table public.bookings
  add column if not exists location_id uuid references public.locations (id) on delete set null;

create index if not exists team_members_location_idx on public.team_members (location_id);
create index if not exists bookings_location_idx on public.bookings (location_id);
