-- =============================================================
-- 0010: content translations — one table for every capability
-- =============================================================
-- Generic field-level translations: (entity, entity_id, locale, field) →
-- value. Rendering falls back to the base (English) column when a
-- translation is missing, so partially-translated content degrades
-- gracefully instead of breaking.

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  -- Table name of the translated row: 'services', 'service_areas', ...
  entity text not null,
  entity_id uuid not null,
  locale text not null check (locale in ('es')),
  field text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  unique (entity, entity_id, locale, field)
);

create index translations_lookup_idx on public.translations (entity, locale, entity_id);

alter table public.translations enable row level security;

create policy "Public read translations" on public.translations
  for select using (true);
create policy "Editors insert translations" on public.translations
  for insert with check (public.is_editor());
create policy "Editors update translations" on public.translations
  for update using (public.is_editor());
create policy "Editors delete translations" on public.translations
  for delete using (public.is_editor());
