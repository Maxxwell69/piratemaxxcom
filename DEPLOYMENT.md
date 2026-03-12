# Railway Deployment Notes — Pirate Maxx

## Quick deploy

1. Push this repo to GitHub (or connect your Git provider in Railway).
2. In Railway: **New Project** → **Deploy from GitHub** → select repo.
3. Railway will detect Next.js and run `npm install`, `npm run build`, and `npm start`.
4. Add variable: `NEXT_PUBLIC_SITE_URL` = your Railway URL or `https://piratemaxx.com` once domain is set.
5. Deploy. Use the generated `.railway.app` URL until you add a custom domain.

## Production settings

- **Node:** 18+ (Railway/Nixpacks typically use Node 20).
- **Build command:** `npm run build` (default for Next.js).
- **Start command:** `npm start` (serves the standalone output from `next build`).
- **Output:** This project uses `output: 'standalone'` in `next.config.js` for smaller, Railway-friendly deploys.

## Custom domain (piratemaxx.com)

1. In Railway: Project → **Settings** → **Domains** → **Custom Domain**.
2. Add `piratemaxx.com` and optionally `www.piratemaxx.com`.
3. In your DNS (e.g. Cloudflare, Namecheap):
   - Add CNAME for `www` → Railway’s provided target.
   - For apex `piratemaxx.com`, use Railway’s recommended A/CNAME or CNAME flattening.
4. Enable SSL in Railway (usually automatic).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full site URL for SEO and OG tags (e.g. `https://piratemaxx.com`). |

Optional (when you add contact/email):

- `RESEND_API_KEY`, `SENDGRID_API_KEY`, or similar for the contact API.
- Any CRM or webhook URLs; reference them in `app/api/contact/route.ts`.

## Troubleshooting

- **Build fails:** Ensure `npm run build` works locally. Check Node version (18+).
- **Blank page / 404:** Confirm root route is deployed and `NEXT_PUBLIC_SITE_URL` is set if you use it in client code.
- **Slow first load:** Standalone build and Railway’s default resources are usually sufficient; consider upgrading plan if needed.

## After deploy

- Test all main routes: `/`, `/about`, `/services`, `/gaming`, `/portfolio`, `/links`, `/contact`.
- Replace placeholder platform links in `data/links.ts` with real URLs.
- When ready, wire the contact form to `app/api/contact/route.ts` and your email/CRM.
