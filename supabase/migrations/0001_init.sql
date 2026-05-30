-- Aman Conseil — initial schema (spec §12)
-- RLS is enabled on every table with NO public policies. All writes happen
-- server-side via the Supabase service role (which bypasses RLS). The /admin
-- back-office reads via the service role behind an auth guard, or via a
-- dedicated admin SELECT policy if Supabase Auth is used.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type lead_status as enum ('nouveau', 'contacte', 'rdv', 'client', 'perdu');
create type verdict as enum ('vert', 'orange', 'rouge');
create type metier as enum (
  'notaire', 'architecte', 'geometre', 'bet', 'btp',
  'geotechnique', 'juriste', 'comptable', 'banquier', 'autre'
);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text not null,
  email text,
  source text,                         -- 'prediagnostic' | 'contact' | ...
  locale text default 'fr',
  statut lead_status default 'nouveau',
  consent_at timestamptz,
  created_at timestamptz default now()
);

-- pre-diagnostics (1 lead → 1..n)
create table prediagnostics (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  reponses jsonb not null,             -- raw answers
  score jsonb not null,                -- { ok, warn, bad, blockingBad }
  verdict verdict not null,
  created_at timestamptz default now()
);

-- contact messages
create table messages_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  contact text not null,
  message text,
  locale text default 'fr',
  consent_at timestamptz,
  created_at timestamptz default now()
);

-- provider applications
create table prestataires (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  metier metier not null,
  ville text,
  telephone text not null,
  email text,
  message text,
  locale text default 'fr',
  consent_at timestamptz,
  created_at timestamptz default now()
);

-- (optional) articles if not using MDX
create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  langue text not null,
  titre text not null,
  meta_description text,
  contenu text,
  published_at timestamptz,
  unique (slug, langue)
);

-- Helpful indexes for the back-office.
create index leads_created_at_idx on leads (created_at desc);
create index leads_statut_idx on leads (statut);
create index prediagnostics_lead_id_idx on prediagnostics (lead_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — ON everywhere, no anon policies.
-- ---------------------------------------------------------------------------
alter table leads            enable row level security;
alter table prediagnostics   enable row level security;
alter table messages_contact enable row level security;
alter table prestataires     enable row level security;
alter table articles         enable row level security;
-- No anon policies. The server uses the service role (bypasses RLS).
-- Add an admin SELECT policy here if you wire /admin to Supabase Auth, e.g.:
--   create policy "admin read leads" on leads for select
--     to authenticated using ( auth.jwt() ->> 'email' = any (string_to_array(current_setting('app.admin_emails', true), ',')) );
