# Yolotech88 — Corporate Website

Modern, responsive, SEO-optimized single-page corporate site for **Yolotech88** — a Data
Engineering, Analytics and Cloud Solutions company.

## Structure

```
yolotech/
├── index.html        # All sections (semantic HTML5 + Tailwind utilities)
├── css/styles.css    # Reusable component classes & effects
├── js/main.js        # Nav, scroll-spy, reveals, counters, form validation
└── README.md
```

## Sections
Hero · About Us · Services · Technologies · Why Yolotech88 · Products (Vendora88) · Contact · Footer

## Run locally
Just open `index.html` in a browser, or serve it:

```bash
# Python
python -m http.server 8080
# or Node
npx serve .
```

Then visit http://localhost:8080

## Features
- White background, blue accent palette, modern typography (Inter + Plus Jakarta Sans)
- Fully responsive / mobile-first with an accessible mobile menu
- SEO: meta + Open Graph + Twitter tags, JSON-LD `Organization` schema, semantic landmarks
- Fast: no heavy frameworks, inline SVG icons, system fonts fallback
- Accessibility: skip link, ARIA states, keyboard focus styles, reduced-motion support
- Interactions: sticky header, scroll-spy nav, reveal-on-scroll, animated stat counters
- Client-side validated contact form (wire up to a backend / form service to receive messages)

## Tailwind CSS (compiled for production)
Tailwind is **precompiled to a minified stylesheet** ([css/tailwind.min.css](css/tailwind.min.css)),
not loaded from the CDN — smaller payload, no runtime, no console warning. The compiled file **is
committed** so the server just needs `git pull` (no build step on the box).

Theme lives in [tailwind.config.js](tailwind.config.js); the entry file is [src/input.css](src/input.css).

**Whenever you add/change Tailwind classes in `index.html` or `js/main.js`, rebuild before pushing:**

```bash
npm install          # first time only (installs tailwindcss)
npm run build:css    # regenerates css/tailwind.min.css (minified)
# then commit the updated css/tailwind.min.css along with your changes
```

During development you can auto-rebuild on save: `npm run watch:css`.

> The config's `content` scans both `index.html` **and** `js/**/*.js`, so classes that only appear
> in JS strings (e.g. the form's `bg-emerald-50` / `bg-red-50` status states) are not purged.

## Contact form (Formspree)
The form POSTs via `fetch` to a Formspree endpoint (see `action` on `#contact-form` in `index.html`)
and submissions are emailed to **raj@yolotech88.com**. Success/error handling lives in
`js/main.js`. To change the destination, update the recipient in the Formspree dashboard (or swap
the form endpoint id).
