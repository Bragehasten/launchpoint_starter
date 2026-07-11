-- =============================================================
-- 0009: service areas — coverage pages for the trades
-- =============================================================
-- Different from locations: a roofer has ONE office but serves five
-- cities. Each area gets a landing page (/service-areas/<slug>) with
-- unique copy, FAQs, and areaServed structured data.

create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,             -- "Jupiter"
  slug text not null unique,      -- "jupiter"
  region text,                    -- "FL"
  -- Unique per-area copy. NOT boilerplate with the city name swapped —
  -- search engines ignore (or penalize) doorway pages.
  intro text not null,
  body text,
  -- [{ "question": "...", "answer": "..." }, ...]
  faqs jsonb not null default '[]',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_areas_active_idx on public.service_areas (active, sort_order);

alter table public.service_areas enable row level security;

create policy "Public read active service areas" on public.service_areas
  for select using (active = true or public.is_editor());
create policy "Editors insert service areas" on public.service_areas
  for insert with check (public.is_editor());
create policy "Editors update service areas" on public.service_areas
  for update using (public.is_editor());
create policy "Editors delete service areas" on public.service_areas
  for delete using (public.is_editor());
