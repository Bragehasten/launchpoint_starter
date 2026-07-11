-- =============================================================
-- 0005: capability tables — team, services, locations, promotions,
--       gallery albums
--
-- Shared conventions: public reads only active/visible rows; editors
-- manage everything; sort_order for manual ordering.
-- =============================================================

-- Team ------------------------------------------------------------------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- Services / menu ---------------------------------------------------------
-- Groups ("Haircuts", "Appetizers") containing items with optional prices.

create table public.service_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.service_groups (id) on delete cascade,
  name text not null,
  description text,
  -- Cents; null = "market price" / hidden.
  price integer,
  -- Free-text price note, e.g. "from", "per person".
  price_note text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- Locations ---------------------------------------------------------------

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  email text,
  -- [{ "days": "Mon–Fri", "hours": "9:00–18:00" }, ...]
  hours jsonb not null default '[]',
  map_url text,
  is_primary boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

-- Promotions / specials -----------------------------------------------------

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  badge text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger promotions_set_updated_at
  before update on public.promotions
  for each row execute function public.set_updated_at();

-- Gallery albums ------------------------------------------------------------

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  media_path text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Row-level security ----------------------------------------------------------

alter table public.team_members enable row level security;
alter table public.service_groups enable row level security;
alter table public.services enable row level security;
alter table public.locations enable row level security;
alter table public.promotions enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_items enable row level security;

-- Public read (active rows); editors manage.
create policy "Public views active team" on public.team_members
  for select using (active = true);
create policy "Editors manage team" on public.team_members
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views service groups" on public.service_groups
  for select using (true);
create policy "Editors manage service groups" on public.service_groups
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views active services" on public.services
  for select using (active = true);
create policy "Editors manage services" on public.services
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views active locations" on public.locations
  for select using (active = true);
create policy "Editors manage locations" on public.locations
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views active promotions" on public.promotions
  for select using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );
create policy "Editors manage promotions" on public.promotions
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views albums" on public.gallery_albums
  for select using (true);
create policy "Editors manage albums" on public.gallery_albums
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public views gallery items" on public.gallery_items
  for select using (true);
create policy "Editors manage gallery items" on public.gallery_items
  for all using (public.is_editor()) with check (public.is_editor());
