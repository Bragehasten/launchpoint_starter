-- =============================================================
-- 0001: profiles, roles, and row-level security
--
-- Apply via the Supabase SQL editor, or with the CLI:
--   npx supabase db push
-- =============================================================

-- Roles ---------------------------------------------------------------

create type public.user_role as enum ('admin', 'editor', 'user');

-- Profiles ------------------------------------------------------------
-- One row per auth user, created automatically on signup.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile for each auth user.';

-- Keep updated_at current on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Create a profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Role helper ----------------------------------------------------------
-- SECURITY DEFINER so RLS policies on profiles can check roles without
-- recursing into their own policies.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Row-level security ----------------------------------------------------
-- Security lives in the database. The UI only decides what to *show*.

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Users may update their own profile but never their own role
-- (role escalation requires an admin).
create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role = (
    select p.role from public.profiles p where p.id = (select auth.uid())
  ));

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- No insert/delete policies: rows are created by the signup trigger and
-- removed by the auth.users cascade. Clients cannot do either directly.
