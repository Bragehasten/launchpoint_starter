-- =============================================================
-- 0003: form submissions + newsletter subscribers
-- =============================================================

-- Form submissions --------------------------------------------------------
-- Generic across form kinds: 'contact' today; quote requests (M10) and any
-- future capability form reuse this table with their own `kind`.

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  email text not null,
  data jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index form_submissions_kind_created_idx
  on public.form_submissions (kind, created_at desc);

-- Newsletter subscribers ----------------------------------------------------

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Row-level security ---------------------------------------------------------
-- Anonymous visitors may INSERT (submit a form / subscribe) but never read.
-- Only editors read and manage. Server actions add rate limiting + honeypot
-- on top.

alter table public.form_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can submit forms" on public.form_submissions
  for insert with check (true);
create policy "Editors view submissions" on public.form_submissions
  for select using (public.is_editor());
create policy "Editors manage submissions" on public.form_submissions
  for update using (public.is_editor());
create policy "Editors delete submissions" on public.form_submissions
  for delete using (public.is_editor());

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
create policy "Editors view subscribers" on public.newsletter_subscribers
  for select using (public.is_editor());
create policy "Editors manage subscribers" on public.newsletter_subscribers
  for update using (public.is_editor());
create policy "Editors delete subscribers" on public.newsletter_subscribers
  for delete using (public.is_editor());
