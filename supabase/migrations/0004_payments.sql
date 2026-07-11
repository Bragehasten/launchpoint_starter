-- =============================================================
-- 0004: payments (Stripe Checkout records)
-- =============================================================

create type public.payment_status as enum ('pending', 'paid', 'refunded', 'failed');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  -- Idempotency anchor: one row per Checkout Session, upserted by the webhook.
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  amount integer not null,
  currency text not null default 'usd',
  status public.payment_status not null default 'pending',
  customer_email text,
  description text,
  -- Deposit metadata, product ids, capability context (booking id...)
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_created_idx on public.payments (created_at desc);

create trigger payments_set_updated_at
  before update on public.payments
  for each row
  execute function public.set_updated_at();

-- RLS: admins read; NOBODY writes through the anon/user API.
-- Rows are written exclusively by the Stripe webhook using the service-role
-- key, which bypasses RLS — that is deliberate: payment records must come
-- only from signature-verified webhook events.

alter table public.payments enable row level security;

create policy "Admins view payments" on public.payments
  for select using (public.is_admin());
