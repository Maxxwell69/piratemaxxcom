# Pirate Maxx — Website

Modern pirate-themed personal brand and business site for **Pirate Maxx**: gaming, streaming, web design, graphic design, and digital branding.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS.

---

## Local development

### Prerequisites

- Node.js 20+ (required by dependencies such as Resend)
- npm (or yarn / pnpm)

### Setup

```bash
# Clone (if applicable) and enter project
cd piratemaxx.com

# Install dependencies
npm install

# Optional: copy env example and set variables
cp .env.example .env.local
# Edit .env.local if needed (e.g. NEXT_PUBLIC_SITE_URL)
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build (production)

```bash
npm run build
```

### Start production server (after build)

```bash
npm start
```

### Lint

```bash
npm run lint
```

---

## Deploying on Vercel

1. **Connect repo**  
   In [Vercel](https://vercel.com), sign in with GitHub (or your Git provider), then **Add New** → **Project** and import this repository.

2. **Build & deploy**  
   Vercel will detect Next.js and run:
   - **Build:** `npm run build`
   - **Deploy:** Automatic; no start command needed (Vercel runs the Next.js server).

3. **Environment variables**  
   In Vercel: Project → **Settings** → **Environment Variables**, add at least:
   - `NEXT_PUBLIC_SITE_URL` = `https://piratemaxx.com` (or your Vercel URL until custom domain is set)  
   - **TikTok live:** Set `TIKTOK_LIVE=true` when you’re live on TikTok; a “LIVE on TikTok” badge appears on the homepage and navbar. Redeploy or use Vercel’s env UI to toggle.

4. **Custom domain (piratemaxx.com)**  
   - In Vercel: Project → **Settings** → **Domains** → Add `piratemaxx.com` and optionally `www.piratemaxx.com`.
   - In your DNS provider, add the CNAME or A records as shown by Vercel.

5. **No extra config**  
   No `vercel.json` is required; Vercel’s Next.js preset handles build and run automatically.

---

## Project structure

```
piratemaxx.com/
├── app/
│   ├── api/contact/     # Placeholder contact API (wire to email/CRM later)
│   ├── about/
│   ├── contact/
│   ├── gaming/
│   ├── links/
│   ├── portfolio/
│   ├── services/
│   ├── layout.tsx
│   ├── page.tsx         # Home
│   └── globals.css
├── components/
│   ├── layout/          # Navbar, Footer, Container, Section, SectionHeader
│   ├── ui/              # HeroSection, PageBanner, ServiceCard, PortfolioCard, StreamLinkCard, CTASection, Badge
│   └── forms/           # ContactForm
├── data/
│   ├── navigation.ts
│   ├── services.ts
│   ├── portfolio.ts
│   ├── links.ts
│   ├── gaming.ts
│   └── cta.ts
├── lib/
│   ├── metadata.ts      # SEO metadata helper
│   └── cdn.ts            # CDN URL helper for images
├── public/
│   └── images/           # Local logos/images (used when no CDN)
├── next.config.js
├── tailwind.config.ts
├── package.json
├── .env.example
└── README.md
```

---

## Updating content

### Text and copy

- **Home:** `app/page.tsx` (hero, intro, “why work with” copy).
- **About:** `app/about/page.tsx` (sections array).
- **Services:** `data/services.ts` (categories, items, deliverables).
- **Gaming:** `data/gaming.ts` (mission, featured games, projects).
- **CTAs:** `data/cta.ts`.

### Links

- **Nav:** `data/navigation.ts` (`mainNav`).
- **Platform/social links:** `data/links.ts` (`platformLinks`, `internalLinks`). Replace placeholder URLs with real TikTok, Twitch, YouTube, etc.

### Services

- Edit or add entries in `data/services.ts` (`serviceCategories`, `homeServicePreviews`).

### Portfolio

- **Seed items (in repo):** `data/portfolio.ts` (`portfolioItems`) — default projects shipped with the site.
- **Admin-added items:** `/admin/portfolio` after setting `ADMIN_JWT_SECRET`, `ADMIN_PORTFOLIO_PASSWORD`, and (on Vercel) `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Locally, without Redis, additions save to `data/portfolio-user.json` (gitignored).
- **Uploads:** Set `BLOB_READ_WRITE_TOKEN` from Vercel → Storage → Blob to upload cover images and video files from the admin form; or paste image/video URLs (e.g. YouTube) without Blob.
- **Categories:** `portfolioCategories` in the same file.
- **Images:** Replace the placeholder block in `components/ui/PortfolioCard.tsx` with Next.js `Image` and use paths in `public/` or URLs in each item.

### TikTok profile and videos

- **Profile:** Edit `data/tiktok.ts` — set `username`, `displayName`, and optionally `profileImageUrl` (e.g. `/images/tiktok-avatar.png`).
- **Videos:** Add full TikTok video URLs to `tiktokVideoUrls` in `data/tiktok.ts` (from TikTok → Share → Copy link). They appear in the “From TikTok” section on the homepage.

### Images and CDN

- **Local:** Put assets in `public/` (e.g. `public/images/logo.png` → `/images/logo.png`).
- **CDN:** Set `NEXT_PUBLIC_CDN_URL` in `.env` (e.g. Cloudinary, `https://cdn.piratemaxx.com`, or imgix). Then use:
  - **`getCdnUrl(path)`** from `lib/cdn.ts` to build full image URLs (e.g. `getCdnUrl('images/logo.png')`).
  - **`<CdnImage src="images/logo.png" alt="..." width={200} height={80} />`** from `components/ui/CdnImage.tsx` for optimized Next.js images.
- If `NEXT_PUBLIC_CDN_URL` is not set, URLs fall back to site-relative paths (served from `public/`).

---

## Contact form

The contact form is frontend-ready; submit is handled in `components/forms/ContactForm.tsx` (currently simulated). To go live:

1. **API route:** `app/api/contact/route.ts` is a placeholder. Implement sending email (e.g. Resend, SendGrid) or posting to a CRM.
2. **Form:** In `ContactForm.tsx`, replace the placeholder submit with `fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, service, message }) })`.
3. Add any API keys or webhook URLs to Railway env (e.g. `RESEND_API_KEY`), not in code.

---

## Future-ready

The structure supports adding:

- Blog/news (e.g. `app/blog/` and a data source).
- Stream schedule (data in `data/gaming.ts` or CMS).
- Testimonials, FAQ, newsletter (sections + data or API).
- CMS (e.g. content in `data/` replaced by CMS fetch in layout/page).
- Admin or booking (new routes and auth as needed).

---

## License

Private / all rights reserved unless otherwise stated.
