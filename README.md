# LOR Generator (Next.js + Supabase)

Self-service Letter of Recommendation generator with admin management and PDF export.

## Features

- Admin login (Supabase Auth)
- Template management
- User record management
- Public verify page (name+email or token)
- Live preview + server-generated PDF download
- Row-level security policies for admin-only writes

## Tech stack

- Next.js (App Router, TypeScript)
- Supabase (Auth, Postgres)
- `@react-pdf/renderer` for PDF generation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://lor-zyntiq.vercel.app
```

4. Run `supabase/schema.sql` in Supabase SQL editor.

5. Create your first admin:

- Create a user in Supabase Auth dashboard.
- Insert that auth user ID and email in `public.admins` with role `super_admin`.

6. Start app:

```bash
npm run dev
```

## Routes

- `/` landing
- `/verify` candidate verification + LOR preview
- `/login` admin login
- `/admin/dashboard` stats
- `/admin/templates` manage templates
- `/admin/users` manage user records

## Security notes

- PDF endpoint now accepts token only and renders from database server-side.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` anywhere client-side.
- Prefer tokenized verification links (`/verify?token=...`) in production.

## Vercel deployment

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Set production domain to `lor-zyntiq.vercel.app`.
5. Deploy.