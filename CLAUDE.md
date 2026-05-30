# CLAUDE.md — Aman Conseil web app

## What this is

Trilingual (FR default / AR rtl / EN) lead-gen site for a Moroccan real-estate
advisory (AMO). The lead magnet is a free land pre-diagnosis. See the build spec
"Aman Conseil - Build Spec (developer).md".

## Stack

Next.js 14 (App Router, TS strict) · Tailwind CSS · Supabase (Postgres + Auth,
RLS on) · next-intl · Resend · Cloudflare Turnstile · Vercel.

## Source of truth

- Design, copy and i18n: ported from `site-maquette/index.html` (the `T`
  dictionary → `messages/*.json`, the `Q` questions → `lib/prediag.ts`).
- Pre-diagnosis scoring: `lib/prediag.ts` mirrors the maquette `computeResult`
  exactly. **Never change questions/scoring without sign-off.**

## Hard rules

- All DB writes happen server-side via the service-role client
  (`lib/supabase/server.ts`). Never write from the client. Never expose
  `SUPABASE_SERVICE_ROLE_KEY`.
- Compute the pre-diagnosis verdict on the server; never trust a client-sent
  verdict.
- Business guardrail: NO "investment opportunity" / fundraising /
  investor-matchmaking wording anywhere. Pure advisory only.
- AR pages must be `dir="rtl"` and use Tajawal.
- Every form: zod validation (client + server) + Turnstile + honeypot + CNDP
  consent (store `consent_at`).

## Conventions

- TypeScript strict. Components in `/components`. Server-only code in
  `/lib/*server*` and Server Actions.
- Conventional commits. Keep PRs small. Maintain tests for scoring and form
  submission.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm test` / `pnpm test:e2e` / `pnpm lint`
