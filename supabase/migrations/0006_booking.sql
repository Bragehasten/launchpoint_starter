-- =============================================================
-- 0006: native booking
--
-- Double-booking is prevented AT THE DATABASE by an exclusion
-- constraint on the time range — no application-level race can
-- create overlapping non-cancelled bookings.
-- =============================================================

create extension if not exists btree_gist;

create type public.booking_status as enum ('pending', 'confirmed', 'cancelled');

-- The booked time range as a value. Marked IMMUTABLE so it can be used in the
-- GiST exclusion constraint below: adding a fixed number of *minutes* to a
-- timestamptz is deterministic (timestamptz is an absolute UTC instant), even
-- though the generic `timestamptz + interval` operator is only STABLE because
-- interval may carry month/day components — which we never use here.
create or replace function public.booking_range(starts_at timestamptz, duration_minutes integer)
returns tstzrange
language sql
immutable
as $$
  select tstzrange(starts_at, starts_at + make_interval(mins => duration_minutes));
$$;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  notes text,
  starts_at timestamptz not null,
  duration_minutes integer not null default 30,
  status public.booking_status not null default 'pending',
  -- Set when a deposit checkout session is created / paid.
  deposit_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_no_overlap exclude using gist (
    public.booking_range(starts_at, duration_minutes) with &&
  ) where (status <> 'cancelled')
);

create index bookings_starts_at_idx on public.bookings (starts_at);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Availability: anonymous visitors need booked time ranges (never PII).
-- SECURITY DEFINER function returns only starts/duration for a window.
create or replace function public.get_booked_ranges(from_ts timestamptz, to_ts timestamptz)
returns table (starts_at timestamptz, duration_minutes integer)
language sql
security definer
set search_path = ''
stable
as $$
  select b.starts_at, b.duration_minutes
  from public.bookings b
  where b.status <> 'cancelled'
    and b.starts_at >= from_ts
    and b.starts_at < to_ts;
$$;

grant execute on function public.get_booked_ranges(timestamptz, timestamptz) to anon, authenticated;

-- RLS: anonymous may INSERT a booking; only editors read/manage.
alter table public.bookings enable row level security;

create policy "Anyone can request a booking" on public.bookings
  for insert with check (true);
create policy "Editors view bookings" on public.bookings
  for select using (public.is_editor());
create policy "Editors manage bookings" on public.bookings
  for update using (public.is_editor());
create policy "Editors delete bookings" on public.bookings
  for delete using (public.is_editor());
