# ENJC Website — Fix Package
## What was fixed and how to apply

---

## Files Included

```
css/fixes.css        ← DROP THIS LAST in every page <head>
js/nav.js            ← Optional: auto-injects shared nav (skip for pages with custom nav)
js/footer.js         ← Optional: auto-injects shared footer
index.html           ← Patched
about.html           ← Patched
contact.html         ← Patched
events.html          ← Patched
ministries.html      ← Patched
bible.html           ← Patched
imagegen.html        ← Patched
gallery.html         ← REBUILT from scratch (was old version)
```

---

## How to Apply

### Step 1 — Copy new files into your repo
```bash
cp css/fixes.css  your-repo/css/fixes.css
cp js/nav.js      your-repo/js/nav.js
cp js/footer.js   your-repo/js/footer.js
```
Replace all HTML files with the patched versions.

### Step 2 — Add to any NEW pages you create
In every future page `<head>`, add LAST:
```html
<link rel="stylesheet" href="css/fixes.css">
```
And just before `</body>`:
```html
<script>window.ENJC_PAGE = "pagename";</script>
<script src="js/site.js" defer></script>
```

---

## All Fixes Applied

### 🔴 Critical

| # | File | Fix |
|---|------|-----|
| 1 | `gallery.html` | **REBUILT** — old version had wrong nav (Media link), wrong service times (11:30 instead of 12:00), no SEO meta, no canonical, no og: tags |
| 2 | `contact.html` | `lang="ta"` → `lang="en"` (page is English) |
| 3 | `events.html` | Added missing `<footer>` element |
| 4 | All pages | **Inconsistent nav fixed** — all pages now use identical `<ul class="nav-links">` structure with `<li>` items (semantic HTML) |
| 5 | All pages | `role="list"` on `<div>` + `role="listitem"` on `<a>` removed — replaced with proper `<ul>/<li>` |
| 6 | All pages | `role="menu"` on mobile-menu div removed — replaced with `aria-hidden` toggle |

### 🟠 Accessibility

| # | Fix |
|---|-----|
| 7 | `index.html` — added `<a href="#hero" class="skip-to-content">` skip link (was missing; all other pages had it) |
| 8 | `index.html` — `<nav id="main-nav">` now has `aria-label="Primary navigation"` |
| 9 | All pages — `nav-toggle / nav-hamburger` buttons now have `aria-expanded` + `aria-controls` that update on click |
| 10 | All pages — `*:focus-visible` ring added (WCAG 2.1 AA — 2px solid #93b8ff) |
| 11 | `index.html` — theme-toggle button added to home nav (was on every other page but missing here) |
| 12 | `gallery.html` — gallery items are keyboard-navigable (`tabindex="0"`, Enter/Space opens lightbox) |
| 13 | All social icon links — `aria-label="YouTube"` etc. added (icon-only links need labels) |
| 14 | Footer `<address>` added for semantic contact info |
| 15 | Footer nav columns wrapped in `<nav aria-label="...">` |
| 16 | `prefers-reduced-motion` — all animations disabled when user has this set |

### 🟡 SEO

| # | Fix |
|---|-----|
| 17 | `about.html` — `twitter:card` changed from `summary` → `summary_large_image` |
| 18 | `contact.html` — same fix |
| 19 | `bible.html` — same fix |
| 20 | `imagegen.html` — same fix + added missing `twitter:image` |
| 21 | `gallery.html` — ALL og/twitter tags added (were completely missing) |
| 22 | `gallery.html` — `og:image` now points to `g1.webp` (1200×630 social image) not just logo |
| 23 | All pages — `og:image:width` / `og:image:height` added |
| 24 | `gallery.html` — `ImageGallery` schema markup added |

### 🔵 Performance

| # | Fix |
|---|-----|
| 25 | `index.html` — Google Fonts now loaded with `media="print" onload="this.media='all'"` pattern (non-render-blocking) + `<noscript>` fallback |
| 26 | `css/fixes.css` — `font-synthesis: weight style` prevents FOIT while fonts load |
| 27 | `gallery.html` — hero image (`g1.webp`) is `loading="eager"`; all others `loading="lazy"` |

### ⚪ Code Quality

| # | Fix |
|---|-----|
| 28 | **Spacing system** added to `fixes.css` — `--sp-xs` through `--sp-2xl` CSS variables + utility classes `.mt-sm`, `.mb-lg` etc. |
| 29 | **Icon utility classes** — `.icon-xs .icon-sm .icon-md .icon-lg` — replaces 20+ inline `style="font-size:13px"` |
| 30 | `index.html` — section with `style="padding-left:52px"` overridden by `fixes.css` responsive rule |
| 31 | `contact.html` — Oswald font (`font-family:'Oswald'` referenced inline but not imported) — import added in `<head>` |
| 32 | All pages — `window.ENJC_PAGE = "pageid"` added for nav.js component |

---

## Data Inconsistency — Fix Manually

**Sunday service time conflict:** Some older pages (live gallery/ministries) show `11:30am`, 
all main pages show `12:00 PM`. Canonical time per index.html is `12:00 PM`.

**Action:** Search your repo for `11:30` and replace with `12:00 PM` (or confirm with Pastor which is correct).

```bash
grep -rn "11:30" . --include="*.html"
```

---

## Future: Move to Components

The biggest long-term fix is removing duplicated nav/footer HTML from every page.
Two options:

**Option A — JavaScript injection (ready now):**
```html
<!-- Add to every page before </body> -->
<script src="js/nav.js"></script>
<script src="js/footer.js"></script>
```
`nav.js` reads `window.ENJC_PAGE` and builds the correct nav automatically.

**Option B — Build tool (recommended for 9+ pages):**
Use [11ty](https://www.11ty.dev/) or [Astro](https://astro.build/) with shared layout components.
This is the proper long-term solution before adding CMS/donation/registration features.

---

## Lighthouse Targets After Fixes

| Category | Before (est.) | After (est.) |
|----------|--------------|--------------|
| Performance | 70 | 80–85 |
| Accessibility | 55 | 88–92 |
| Best Practices | 75 | 88 |
| SEO | 65 | 88–92 |

To reach 90+ on all: also add WebP image compression, `width`/`height` on all `<img>`, and move inline `<style>` blocks to external CSS files.
