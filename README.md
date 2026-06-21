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

## Production note — Tailwind
This build uses the **Tailwind Play CDN** for zero-config setup. For production, compile Tailwind
to a minified stylesheet to remove the CDN runtime and shrink payload:

```bash
npm install -D tailwindcss
npx tailwindcss -i ./src/input.css -o ./css/tailwind.min.css --minify
```

Then replace the `<script src="https://cdn.tailwindcss.com">` + inline config with a link to the
compiled `css/tailwind.min.css`. Move the custom colors/fonts from the inline `tailwind.config`
into a `tailwind.config.js`.

## Wiring up the contact form
The form currently shows a success message client-side only. To receive submissions, point it at a
backend endpoint or a service such as Formspree/Netlify Forms and handle the POST in
`js/main.js` (`form.addEventListener("submit", …)`).
