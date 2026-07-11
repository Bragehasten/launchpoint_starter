-- =============================================================
-- 0002: CMS core — posts, categories, pages, media, storage
-- =============================================================

-- Role helper: editors and admins may manage content.
create or replace function public.is_editor()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  );
$$;

-- Content status -------------------------------------------------------

create type public.content_status as enum ('draft', 'published', 'archived');

-- Categories -----------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- Posts ----------------------------------------------------------------
-- Scheduled publishing = status 'published' with a future published_at.
-- Public queries filter published_at <= now(), so no cron is needed.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content jsonb not null default '{"type":"doc","content":[]}',
  cover_image text,
  author_id uuid references public.profiles (id) on delete set null,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_status_published_at_idx on public.posts (status, published_at desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

create table public.post_categories (
  post_id uuid not null references public.posts (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (post_id, category_id)
);

-- CMS pages (ordered section blocks validated by the section registry) ---

create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  blocks jsonb not null default '[]',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger cms_pages_set_updated_at
  before update on public.cms_pages
  for each row
  execute function public.set_updated_at();

-- Media library ----------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Row-level security ------------------------------------------------------

alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_categories enable row level security;
alter table public.cms_pages enable row level security;
alter table public.media enable row level security;

-- Categories: public read, editors write.
create policy "Public can view categories" on public.categories for select using (true);
create policy "Editors manage categories" on public.categories
  for all using (public.is_editor()) with check (public.is_editor());

-- Posts: public sees only live content; editors see and manage everything.
create policy "Public can view published posts" on public.posts for select
  using (status = 'published' and published_at <= now());
create policy "Editors view all posts" on public.posts for select using (public.is_editor());
create policy "Editors manage posts" on public.posts
  for all using (public.is_editor()) with check (public.is_editor());

create policy "Public can view post categories" on public.post_categories for select using (true);
create policy "Editors manage post categories" on public.post_categories
  for all using (public.is_editor()) with check (public.is_editor());

-- Pages: same shape as posts.
create policy "Public can view published pages" on public.cms_pages for select
  using (status = 'published' and published_at <= now());
create policy "Editors view all pages" on public.cms_pages for select using (public.is_editor());
create policy "Editors manage pages" on public.cms_pages
  for all using (public.is_editor()) with check (public.is_editor());

-- Media: public read (images are public anyway), editors write.
create policy "Public can view media" on public.media for select using (true);
create policy "Editors manage media" on public.media
  for all using (public.is_editor()) with check (public.is_editor());

-- Storage bucket -----------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media objects" on storage.objects for select
  using (bucket_id = 'media');
create policy "Editors upload media objects" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_editor());
create policy "Editors update media objects" on storage.objects for update
  using (bucket_id = 'media' and public.is_editor());
create policy "Editors delete media objects" on storage.objects for delete
  using (bucket_id = 'media' and public.is_editor());
