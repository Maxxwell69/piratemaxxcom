# Pirate Maxx — Website

Modern pirate-themed personal brand and business site for **Pirate Maxx**: gaming, streaming, web design, graphic design, and digital branding.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS.

---

## Local development

### Prerequisites

- Node.js 18+
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

## Deploying on Railway

1. **Connect repo**  
   In [Railway](https://railway.app), create a new project and connect this repository.

2. **Build & start**  
   Railway will detect Next.js and run:
   - **Build:** `npm run build` (or use Nixpacks default)
   - **Start:** `npm start`

3. **Environment variables**  
   In Railway project → Variables, add at least:
   - `NEXT_PUBLIC_SITE_URL` = `https://piratemaxx.com` (or your Railway URL until custom domain is set)  
   - **TikTok live:** Set `TIKTOK_LIVE=true` when you’re live on TikTok; a “LIVE on TikTok” badge appears on the homepage and navbar. Restart the app to toggle (no redeploy).

4. **Custom domain (piratemaxx.com)**  
   - In Railway: Project → Settings → Domains → Add custom domain (`piratemaxx.com`, `www.piratemaxx.com`).
   - In your DNS provider, add the CNAME (or A record) as shown by Railway.

5. **Optional config**  
   - `railway.json` and `nixpacks.toml` are included for explicit build/start behavior; Railway’s auto-detect often works without them.

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
├── railway.json
├── nixpacks.toml
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

- **Items:** `data/portfolio.ts` (`portfolioItems`). Add/remove/edit title, category, description, `link`, `tags`.
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
