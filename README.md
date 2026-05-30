# Aman Conseil

Trilingual (FR / AR / EN), mobile-first, SEO-optimized lead-generation website
for **Aman Conseil**, a real-estate development advisory (AMO) firm in Morocco.

The core asset is a free **land pre-diagnosis** tool that captures a contact,
returns an instant verdict (🟢 / 🟠 / 🔴), stores the lead, and notifies the team.

## Stack

Next.js 14 (App Router, TypeScript) · Tailwind CSS · Supabase (Postgres + Auth) ·
next-intl · Resend · Cloudflare Turnstile · Vercel.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your values
pnpm dev                     # http://localhost:3000
```

The default locale is `fr`. Locales: `fr`, `ar` (RTL), `en`.

## Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Run the dev server                |
| `pnpm build`     | Production build                  |
| `pnpm start`     | Run the production build          |
| `pnpm lint`      | ESLint                            |
| `pnpm format`    | Prettier                          |
| `pnpm test`      | Unit tests (Vitest)               |
| `pnpm test:e2e`  | End-to-end tests (Playwright)     |

## Source of truth

`site-maquette/index.html` is the visual + copy + i18n + pre-diagnosis reference.
The trilingual copy is ported into `messages/{fr,ar,en}.json`, and the 10
pre-diagnosis questions + scoring into `lib/prediag.ts`. See `CLAUDE.md` for the
hard rules (server-only writes, no fundraising wording, RTL, consent).

## Deployment

GitHub → import to **Vercel** → set the env vars from `.env.example` → connect
`amanconseil.ma` (+ `www`). Supabase project in the `eu-west` region.
