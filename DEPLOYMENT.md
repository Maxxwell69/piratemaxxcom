# Vercel Deployment Notes — Pirate Maxx

## Quick deploy

1. Push this repo to GitHub (or connect your Git provider in Vercel).
2. In Vercel: **Add New** → **Project** → **Import** this repository.
3. Vercel will detect Next.js and run `npm install` and `npm run build`; no start command needed.
4. Add variable: `NEXT_PUBLIC_SITE_URL` = your Vercel URL or `https://piratemaxx.com` once domain is set.
5. Deploy. Use the generated `.vercel.app` URL until you add a custom domain.

## Production settings

- **Node:** 18+ (Vercel uses a compatible Node version by default).
- **Build command:** `npm run build` (Vercel’s Next.js preset).
- **Output:** Standard Next.js build; no standalone output required on Vercel.

## Custom domain (piratemaxx.com)

1. In Vercel: Project → **Settings** → **Domains** → **Add**.
2. Add `piratemaxx.com` and optionally `www.piratemaxx.com`.
3. In your DNS (e.g. Cloudflare, Namecheap):
   - Add CNAME for `www` → `cname.vercel-dns.com` (or the target Vercel shows).
   - For apex `piratemaxx.com`, use Vercel’s A records or CNAME flattening as shown in the dashboard.
4. SSL is automatic on Vercel.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full site URL for SEO and OG tags (e.g. `https://piratemaxx.com`). |

Community sign-up (`/community/signup`, `/community/login`):

| Variable | Required | Description |
|----------|----------|-------------|
| `MEMBER_JWT_SECRET` | **Yes** (for community) | At least **32 characters**, random. Signs member session cookies. Generate e.g. with `openssl rand -base64 32` or any password manager’s random string. |
| `UPSTASH_REDIS_REST_URL` | **Yes** on serverless prod | Same Redis as portfolio admin; without it, member storage is unavailable in production (sign-up returns 503). |
| `UPSTASH_REDIS_REST_TOKEN` | **Yes** with URL | Pair with the URL above. |

Optional (when you add contact/email):

- `RESEND_API_KEY`, `SENDGRID_API_KEY`, or similar for the contact API.
- Any CRM or webhook URLs; reference them in `app/api/contact/route.ts`.

## Troubleshooting

- **503 on community sign-up:** Set `MEMBER_JWT_SECRET` (32+ characters) in the project’s environment (Vercel, Railway, etc.) and redeploy. If the error mentions storage, add Upstash `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as well.
- **Build fails:** Ensure `npm run build` works locally. Check Node version (18+).
- **Blank page / 404:** Confirm root route is deployed and `NEXT_PUBLIC_SITE_URL` is set if you use it in client code.
- **Slow first load:** Vercel’s edge and serverless setup is optimized by default; check Analytics if you need to tune.

## After deploy

- Test all main routes: `/`, `/about`, `/services`, `/gaming`, `/portfolio`, `/links`, `/contact`.
- Replace placeholder platform links in `data/links.ts` with real URLs.
- When ready, wire the contact form to `app/api/contact/route.ts` and your email/CRM.
