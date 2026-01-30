# ISD Teachers

Student reviews for Skyline, Issaquah, and Liberty High School with an admin
moderation queue. Built with Next.js + Supabase.

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Enable Google OAuth in Supabase Auth and add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://idsteachers.org/auth/callback`

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_EMAILS=Justicemw9857@gmail.com,skytheredhead@gmail.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-your-adsense-id
```

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy (free)

- Deploy to Vercel (free tier).
- Add the same environment variables in Vercel project settings.
- Point `idsteachers.org` at Vercel via Cloudflare DNS.

## Admin access

- Admins must sign in with Google OAuth.
- Only the emails listed in `ADMIN_EMAILS` can approve or reject reviews.
