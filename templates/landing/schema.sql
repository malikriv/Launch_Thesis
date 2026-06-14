-- BuilderKit validate — capture store (Postgres / Supabase flavored).
-- Idempotent: the unique key collapses refreshes/retries so counts can't inflate.
-- Columns mirror the gate-eval.mjs event shape exactly.
create table if not exists builderkit_events (
  id           bigint generated always as identity primary key,
  ts           timestamptz not null default now(),
  tier         text not null check (tier in
                 ('land','signup','activation','payment','loi','scarce_action','intent_click')),
  cohort       text not null default 'unverifiable' check (cohort in
                 ('cold_public','warm_dm','friend','unverifiable')),
  email        text,
  session      text not null,
  source       text,                       -- tracked-link / channel tag (UTM)
  amount       numeric not null default 0, -- payment: authorized/charged; else 0
  live         boolean not null default false,
  is_founder   boolean not null default false,
  -- natural key for idempotency: one row per (person-or-session, tier)
  dedupe_key   text generated always as (coalesce(lower(email), 'session:' || session) || ':' || tier) stored,
  unique (dedupe_key)
);
-- Upsert pattern (client/edge uses ON CONFLICT DO NOTHING so the FIRST signal wins):
--   insert into builderkit_events (tier,cohort,email,session,source,amount,live,is_founder)
--   values (...) on conflict (dedupe_key) do nothing;
