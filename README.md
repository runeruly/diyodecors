# DiyoDecors (`diyodecors.com`)

Luxury event styling and decoration website for **DiyoDecors** (serving Washington DC, Maryland, and Virginia).

## Architecture (Node.js + Astro Static Generation)

The website uses **Astro** (`src/`) to compile modular components and data into static HTML files in the project root (`/`):

- `src/layouts/BaseLayout.astro` — Master HTML shell, SEO/OpenGraph tags, strict `Content-Security-Policy`, JSON-LD structured data, and Google Fonts (`Cinzel`, `Cormorant Garamond`, `Montserrat`).
- `src/components/Header.astro` & `src/components/Footer.astro` — Shared navigation header, mobile slide-out drawer, footer, and sticky mobile quick-contact bar.
- `src/components/PaletteStudio.astro` — Interactive **Curate Your Signature Palette** mood studio.
- `src/components/HotspotShowcase.astro` — Interactive **Anatomy of a Diyo Setup** stage hotspot showcase.
- `src/data/services.js` & `src/pages/[service].astro` — Single source of truth generating all 12 service detail pages (`weddings.html`, `pasni.html`, `bartabanda.html`, `birthdays.html`, etc.).
- `assets/css/styles.css` & `assets/js/script.js` — Global stylesheet and client-side interactions.

## Development & Build Workflow

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Build & sync static HTML to root:**
   ```bash
   npm run build
   ```
   *(Runs `astro build` followed by `node scripts/sync-build.mjs`, which copies all compiled `.html` files from `dist/` into the repository root `/` and verifies `.nojekyll`.)*

---

## ⚠️ Critical GitHub Pages Deployment Note (`.nojekyll`)

**NEVER delete the `.nojekyll` file in the project root.**

### Why `.nojekyll` is Required
- GitHub Pages serves this repository from the root (`/`) of the `main` branch.
- By default, GitHub Pages runs a `Build with Jekyll` step on every push unless `.nojekyll` is present in the root folder.
- Because `src/**/*.astro` files use `---` JavaScript frontmatter fences, Jekyll will mistakenly try to parse `src/**/*.astro` as Ruby/YAML frontmatter and **fail the GitHub Pages deployment** if `.nojekyll` is missing.
- **Automated Safeguard:** `scripts/sync-build.mjs` automatically checks for `.nojekyll` on every `npm run build` and recreates it if it is ever missing.
