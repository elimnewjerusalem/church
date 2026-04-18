# ENJC Website — Developer Documentation

> **For humans and Claude alike.**  
> Read this before making any changes to the website code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [How to Deploy](#3-how-to-deploy)
4. [Design System](#4-design-system)
5. [CSS Architecture](#5-css-architecture)
6. [JavaScript Architecture](#6-javascript-architecture)
7. [Page-by-Page Reference](#7-page-by-page-reference)
8. [Shared Components](#8-shared-components)
9. [How to Make Common Changes](#9-how-to-make-common-changes)
10. [Naming Conventions](#10-naming-conventions)
11. [Accessibility Notes](#11-accessibility-notes)

---

## 1. Project Overview

**Church:** Elim New Jerusalem Church (ENJC)  
**Location:** No.110E, Ellaya Mudali Street, Tondiarpet, Chennai – 600 081  
**Pastor:** Pastor A. Karthik Daniel  
**Phone:** +91 94443 45102  
**Email:** enjcofficial@gmail.com  
**Hosting:** GitHub Pages — `https://elimnewjerusalem.github.io/church/`  
**YouTube:** `https://www.youtube.com/@elimnewjerusalemchurch`  
**WhatsApp:** `https://wa.me/919444345102`

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styles | Single shared CSS file (`css/main.css`) with CSS custom properties |
| Scripts | Vanilla JS — no frameworks or build tools |
| Fonts | Google Fonts (Playfair Display + Poppins + Noto Serif Tamil) |
| Hosting | GitHub Pages (static) |

---

## 2. File Structure

```
church/
├── index.html          ← Home page (hero + prayer timings + 2026 dates)
├── about.html          ← About ENJC (Pastor + Ministry + Mission + Vision)
├── contact.html        ← Contact info + WhatsApp form + social links + map
├── events.html         ← Live stream + countdown + videos + testimonials
├── gallery.html        ← Photo masonry grid
├── ministries.html     ← 6 ministry cards
│
├── css/
│   └── main.css        ← ONLY stylesheet — all pages share this
│
├── js/
│   └── site.js         ← ONLY shared script (theme, menu, scroll-top)
│
├── images/
│   ├── logo/
│   │   └── logo.png    ← ENJC logo (NEW_LOGO.png renamed)
│   ├── home/
│   │   ├── slide1.jpg  ← Hero desktop image
│   │   └── slide2.jpg  ← Hero mobile image (shown ≤600px)
│   ├── gallery/        ← Drop photos here for gallery page
│   │   ├── g1.jpg
│   │   ├── g2.jpg
│   │   └── g3.jpg
│   ├── ministries/     ← One photo per ministry card
│   │   ├── youth.jpg
│   │   ├── women.jpg
│   │   ├── prayer.jpg
│   │   ├── worship.jpg
│   │   ├── children.jpg
│   │   └── outreach.jpg
│   ├── social/         ← Social profile thumbnails (used in older pages)
│   └── Live/           ← Thumbnail images for video sections
│
├── data/               ← JSON data files for Bible app
│   ├── bible-data.json
│   ├── bible-topics.json
│   ├── events.json
│   └── tamil-bible.json
│
└── bible.html + js/bible.js  ← Standalone Tamil/English Bible app
```

### Key rule
> **Every HTML page links to the same `css/main.css` and `js/site.js`.**  
> Never add a second stylesheet or duplicate CSS between pages.

---

## 3. How to Deploy

### Hosting on GitHub Pages

```bash
# Clone the repo
git clone https://github.com/elimnewjerusalem/church.git
cd church

# Make changes, then push
git add .
git commit -m "describe what you changed"
git push origin main
```

GitHub Pages automatically deploys `main` branch to:  
`https://elimnewjerusalem.github.io/church/`

### Minimum files needed on the server

```
index.html
about.html
contact.html
events.html
gallery.html
ministries.html
css/main.css
js/site.js
images/logo/logo.png
images/home/slide1.jpg
images/home/slide2.jpg
```

All other image folders are optional (pages degrade gracefully with fallbacks).

---

## 4. Design System

All design values live as **CSS custom properties** in `:root` inside `css/main.css`.  
**Never hardcode hex colours or pixel values directly in HTML or page-specific CSS.**  
Always use a token variable.

### Colour tokens

| Token | Dark value | Light value | Used for |
|-------|-----------|-------------|---------|
| `--color-bg` | `#07090f` | `#f8f6f1` | Page background |
| `--color-bg-2` | `#0d1119` | `#eeece6` | Card backgrounds, alt sections |
| `--color-bg-3` | `#131b27` | `#e4e0d8` | Video embed backgrounds |
| `--color-text` | `#f0ece4` | `#1c1710` | Headings, primary text |
| `--color-text-muted` | `rgba(240,236,228,.65)` | `rgba(28,23,16,.62)` | Body paragraphs |
| `--color-text-faint` | `rgba(240,236,228,.35)` | `rgba(28,23,16,.38)` | Captions, labels |
| `--color-border` | `rgba(255,255,255,.07)` | `rgba(28,23,16,.09)` | Subtle dividers |
| `--color-border-mid` | `rgba(255,255,255,.13)` | `rgba(28,23,16,.18)` | Hover borders |
| `--color-gold` | `#e8a020` | `#9a6c0a` | Accent — all highlights |
| `--color-gold-bg` | `rgba(232,160,32,.10)` | `rgba(154,108,10,.09)` | Gold card background |
| `--color-gold-border` | `rgba(232,160,32,.28)` | `rgba(154,108,10,.28)` | Gold card border |

### Typography tokens

| Token | Value |
|-------|-------|
| `--font-heading` | `'Playfair Display', Georgia, serif` |
| `--font-body` | `'Poppins', system-ui, sans-serif` |
| `--font-tamil` | `'Noto Serif Tamil', serif` |

### Spacing & shape tokens

| Token | Value | Used for |
|-------|-------|---------|
| `--nav-height` | `64px` | Sticky nav height |
| `--max-width` | `1240px` | Max container width |
| `--radius-sm` | `10px` | Inputs, small cards |
| `--radius-md` | `16px` | Large cards, modals |

### Dark / Light mode

Theme is stored in `localStorage` under the key `enjc-theme`.  
`site.js` reads it before first paint to prevent flash.  
Toggle button is the pill switch in the nav (`.theme-toggle`).  
All colour changes happen automatically via `[data-theme="light"]` overrides in `main.css`.

---

## 5. CSS Architecture

**File:** `css/main.css`

Sections are clearly commented and ordered:

```
@import Google Fonts
── DESIGN TOKENS      (:root variables + [data-theme="light"] overrides)
── RESET              (box-sizing, margin, padding)
── BASE               (body, headings, p, a, img)
── LAYOUT             (.container, .section, .section-alt, .section-sm, .divider, .grid-*)
── NAVIGATION         (.site-nav, .nav-logo, .nav-link, .theme-toggle, .nav-hamburger, .mobile-menu)
── HERO               (.hero, .hero__image, .hero__overlay, .hero__content, etc.)
── PAGE HERO          (.page-hero — inner page banner)
── SECTION LABELS     (.section-tag, .section-heading, .section-rule, .section-sub)
── CARDS              (.card, .card--gold, .service-slot, .activity-card, .date-card)
── BUTTONS            (.btn, .btn--gold, .btn--outline, .btn--ghost)
── BADGES             (.badge, .badge--gold, .badge--blue, .badge--green)
── FORMS              (.form-field)
── FOOTER             (.site-footer, .site-footer__inner, .site-footer__logo, .site-footer__copy)
── BOTTOM NAV         (.bottom-nav, .bottom-nav__item, .bottom-nav__bible-btn)
── FLOATING ACTIONS   (.wa-float, .scroll-top-btn)
── RESPONSIVE         (@media breakpoints)
```

### Breakpoints

| Breakpoint | Behaviour |
|-----------|----------|
| `≤ 900px` | Desktop nav hides, hamburger shows, bottom-nav appears, `body` gets `padding-bottom:68px` |
| `≤ 768px` | Container padding reduces to 18px, sections compress, `grid-2` collapses to 1 col |
| `≤ 600px` | Hero swaps desktop→mobile image, footer stacks vertically |
| `≥ 901px` | Bottom nav hidden, floating buttons reposition to bottom-right corner |

### Grid helpers

| Class | Columns | Gap |
|-------|---------|-----|
| `.grid-2` | 2 equal cols | 28px |
| `.grid-3` | 3 equal cols | 24px |
| `.grid-4` | 4 equal cols | 12px |

All grids collapse to fewer columns at the responsive breakpoints above.

---

## 6. JavaScript Architecture

**File:** `js/site.js`

Single IIFE — runs immediately before DOM is ready.  
Exposes 3 global functions used by `onclick` attributes in HTML:

| Function | Called by | What it does |
|----------|----------|-------------|
| `toggleTheme()` | `.theme-toggle` button | Flips dark↔light, saves to `localStorage` |
| `toggleMenu()` | `.nav-hamburger` button | Toggles `.is-open` class on `#mobile-menu` |
| `goTop()` | `#scroll-top-btn` button | `window.scrollTo({ top:0, behavior:'smooth' })` |

The scroll event listener adds/removes `.is-visible` on `#scroll-top-btn` when page scrolls past 320px.

### Page-specific scripts

These are `<script>` blocks inside individual HTML files — **not** in `site.js`:

| Page | Script | What it does |
|------|--------|-------------|
| `contact.html` | `sendViaWhatsApp()` | Reads form fields, builds WhatsApp URL, opens in new tab |
| `events.html` | `startCountdown()` IIFE | Updates `#cd-d/h/m/s` every second until next Sunday 5:30 AM |
| `events.html` | Testimonials IIFE | Array-backed carousel, `changeTestimonial(dir)` global |

---

## 7. Page-by-Page Reference

### `index.html` — Home

**Sections (top to bottom):**
1. **Hero** — desktop `slide1.jpg` + mobile `slide2.jpg`. Overlay text: Isaiah 43:4. Two CTA buttons (Join Us / Watch Live).
2. **Church Worship & Service Times** — Sunday gold card (3 time slots) + Friday/Missionary/Village/Gospel/Fasting/Deliverance ministry cards.
3. **Church Programmes** — Promise Worship, Sunday School, VBS.
4. **Deliverance Meeting Dates 2026** — 12-month grid, note June (14 Jun) is included even though original spec skipped it.

**Active nav link:** `Home`  
**Bottom nav active:** `Home` (🏠)

---

### `about.html` — About Us

**Sections:**
1. **Pastor** — Avatar placeholder + Pastor A. Karthik Daniel bio. When a photo is available, replace the emoji div with `<img src="images/pastor.jpg" alt="Pastor A. Karthik Daniel">`.
2. **Deliverance Ministry** — 3 cards: Prayer & Intercession, Word & Worship, Holy Spirit Ministry.
3. **Mission** — 3 checkmark items in a list.
4. **Vision** — 5 items: worldwide branches, deliverance ministries, youth, schools/sports, Tamil Nadu villages.
5. **Foundation verse** — `<blockquote>` with Isaiah 43:4.

**Active nav link:** `About`  
**Bottom nav active:** `About` (✝)

---

### `contact.html` — Contact Us

**Sections:**
1. **Contact Info** — Address, Phone, Email, WhatsApp (4 info cards).
2. **Service Times** — Same timings as index but in row format.
3. **Prayer Request** — Gold card with WhatsApp deep-link.
4. **WhatsApp Form** — Name*, Email*, Phone, Subject, Message*. `sendViaWhatsApp()` opens WhatsApp with formatted message.
5. **Follow Us** — 4 social cards: YouTube, WhatsApp, Instagram, Facebook.
6. **Map** — Google Maps iframe of Tondiarpet area.

**Page-specific JS:** `sendViaWhatsApp()` — validates name + message, builds encoded WhatsApp URL.

**Active nav link:** `Contact`  
**Bottom nav active:** `Contact` (✉)

---

### `events.html` — Live & Events

**Sections:**
1. **Live Stream** — Status banner + 3-col quick service times grid.
2. **Countdown** — Counts down to next Sunday 5:30 AM. Updates every second.
3. **Recent Live Streams** — 3 YouTube embeds (landscape 16:9).
4. **Most Watched Messages** — 3 YouTube embeds with "Most Watched" badge.
5. **Verse Reels** — 3 YouTube Shorts (portrait 9:16).
6. **Testimonials** — 3-item carousel, auto-advances every 5 seconds.

**YouTube video IDs currently used:**  
- `A8EO7eY1s34` (Sunday)  
- `7RD41E4ticY` (Friday)  
- `tQ0J_tBsNU0` (Night Prayer)

To update: search for the video ID in `events.html` and replace all occurrences.

**Active nav link:** `Events`  
**Bottom nav active:** `Events` (📅)

---

### `gallery.html` — Photo Gallery

**Layout:** CSS `columns: 3` masonry grid. Each item is a `<figure>` with `<figcaption>`.

**To add real photos:** Replace each `<figure class="gallery-grid__item">` with:
```html
<figure class="gallery-grid__item" style="aspect-ratio:4/3;">
  <img src="images/gallery/your-photo.jpg" alt="Description of photo" loading="lazy">
  <figcaption>Caption text</figcaption>
</figure>
```

**Active nav link:** `Gallery`  
**Bottom nav active:** none (gallery not in bottom nav)

---

### `ministries.html` — Our Ministries

**6 ministry cards:**

| Ministry | Image file | WhatsApp message |
|----------|-----------|-----------------|
| Youth Ministry | `images/ministries/youth.jpg` | `Hi, I want to join Youth Ministry` |
| Women's Fellowship | `images/ministries/women.jpg` | `Hi, I want to join Women's Fellowship` |
| Prayer Ministry | `images/ministries/prayer.jpg` | `Hi, I want to join Prayer Ministry` |
| Worship Ministry | `images/ministries/worship.jpg` | `Hi, I want to join Worship Ministry` |
| Children's Ministry | `images/ministries/children.jpg` | `Hi, I want to join Children's Ministry` |
| Outreach Ministry | `images/ministries/outreach.jpg` | `Hi, I want to join Outreach Ministry` |

Each card has a gradient overlay fallback — the overlay hides automatically via CSS once the real image loads.

**Active nav link:** `Ministries`  
**Bottom nav active:** none (ministries not in bottom nav)

---

### `bible.html` + `js/bible.js` — Tamil/English Bible

Standalone app. Has its own nav (updated to match site design) and its own WA float button. Does **not** share `site.js` theme logic — has its own inline theme script. The Bible app is outside the scope of this design system refactor.

---

## 8. Shared Components

Every page uses the same nav and footer HTML pattern. When editing, **change all pages** or use find-and-replace in your editor.

### Navigation (`<header>` + `<nav class="site-nav">`)

```html
<header>
  <nav class="site-nav" aria-label="Primary navigation">
    <div class="container">
      <!-- Logo -->
      <a href="index.html" class="nav-logo" aria-label="ENJC home">
        <img src="images/logo/logo.png" class="nav-logo__img" alt="ENJC logo"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <span class="nav-logo__fallback">ENJC</span>
        <div>
          <div class="nav-logo__name">ENJC</div>
          <div class="nav-logo__sub">Elim New Jerusalem Church</div>
        </div>
      </a>

      <!-- Desktop links — add class nav-link--active to current page -->
      <div class="nav-links" role="list">
        <a href="index.html"      class="nav-link [nav-link--active]">Home</a>
        <a href="about.html"      class="nav-link">About</a>
        <a href="gallery.html"    class="nav-link">Gallery</a>
        <a href="ministries.html" class="nav-link">Ministries</a>
        <a href="events.html"     class="nav-link">Events</a>
        <a href="contact.html"    class="nav-link">Contact</a>
        <a href="bible.html"      class="nav-link">Bible</a>
      </div>

      <!-- Theme toggle + Visit Us -->
      <div class="nav-controls">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark/light theme">
          <div class="theme-toggle__dot"></div>
        </button>
        <a href="https://maps.app.goo.gl/QUGpNoohYrcihMkR7" target="_blank" rel="noopener" class="nav-visit-btn">
          📍 Visit Us
        </a>
      </div>

      <!-- Hamburger (mobile only) -->
      <button class="nav-hamburger" onclick="toggleMenu()" aria-label="Open menu">
        <span class="nav-hamburger__line"></span>
        <span class="nav-hamburger__line"></span>
        <span class="nav-hamburger__line"></span>
      </button>
    </div>

    <!-- Mobile dropdown — add class is-active to current page link -->
    <div class="mobile-menu" id="mobile-menu" role="menu">
      <a href="index.html"      class="mobile-menu__link [is-active]">Home</a>
      <a href="about.html"      class="mobile-menu__link">About</a>
      ...
    </div>
  </nav>
</header>
```

### Footer

```html
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__inner">
      <div class="site-footer__logo">ENJC — Elim New Jerusalem Church</div>
      <div class="site-footer__copy">© 2026 · Tondiarpet, Chennai · +91 94443 45102</div>
    </div>
  </div>
</footer>
```

### WhatsApp Float Button

```html
<a href="https://wa.me/919444345102" target="_blank" rel="noopener"
   class="wa-float" title="Chat on WhatsApp" aria-label="Chat on WhatsApp">
  <!-- WhatsApp SVG icon -->
</a>
```

### Scroll-to-top Button

```html
<button class="scroll-top-btn" id="scroll-top-btn" onclick="goTop()" aria-label="Back to top">↑</button>
```

Becomes visible (`.is-visible` class) once user scrolls past 320px.

### Mobile Bottom Nav

```html
<nav class="bottom-nav" aria-label="Mobile navigation">
  <a href="index.html"   class="bottom-nav__item [is-active]">
    <span class="bottom-nav__icon">🏠</span>
    <span class="bottom-nav__label">Home</span>
  </a>
  <a href="about.html"   class="bottom-nav__item">
    <span class="bottom-nav__icon">✝</span>
    <span class="bottom-nav__label">About</span>
  </a>
  <div class="bottom-nav__center">
    <a href="bible.html" class="bottom-nav__bible-btn" aria-label="Bible">📖</a>
  </div>
  <a href="events.html"  class="bottom-nav__item">
    <span class="bottom-nav__icon">📅</span>
    <span class="bottom-nav__label">Events</span>
  </a>
  <a href="contact.html" class="bottom-nav__item">
    <span class="bottom-nav__icon">✉</span>
    <span class="bottom-nav__label">Contact</span>
  </a>
</nav>
```

---

## 9. How to Make Common Changes

### Add a new page

1. Copy `gallery.html` (simplest page) as your starting template.
2. Update `<title>` and `<meta name="description">`.
3. Set `nav-link--active` on the correct nav link in both desktop and mobile menus.
4. Set `is-active` on the correct bottom-nav item (if it's Home/About/Events/Contact).
5. Write `<main>` content using existing classes from `main.css`.
6. Never add a `<style>` block — add new rules to `css/main.css` instead.

### Change a colour

Edit the CSS variable in `:root` inside `css/main.css`. If the colour only applies in light mode, edit the `[data-theme="light"]` block.

```css
/* Example: change gold accent */
:root {
  --color-gold: #e8a020;  /* ← change this */
}
[data-theme="light"] {
  --color-gold: #9a6c0a;  /* ← and this */
}
```

### Update church phone number

Search all HTML files for `919444345102` and replace. Also update `site-footer__copy` text.

### Update service times

- **Home page:** `index.html` → "WORSHIP SERVICES" section
- **Contact page:** `contact.html` → "Service Times" column
- **Events page:** `events.html` → quick-view grid + countdown target time (`5, 30, 0, 0` in the JS)

### Add a ministry photo

Drop `youth.jpg` (or whichever ministry) into `images/ministries/`.  
The CSS rule `.ministry-card__image img:not([src=""]) + .ministry-card__overlay { display: none; }` automatically hides the gradient fallback once the image loads.

### Add gallery photos

Add `<figure>` elements inside `#gallery-grid` in `gallery.html`:

```html
<figure class="gallery-grid__item" style="aspect-ratio:4/3;">
  <img src="images/gallery/worship-2026.jpg" alt="Sunday worship service" loading="lazy">
  <figcaption>Sunday Worship 2026</figcaption>
</figure>
```

### Update YouTube video IDs

In `events.html`, find the old ID (e.g. `A8EO7eY1s34`) and replace with the new YouTube video ID.  
The ID is the part after `?v=` in a YouTube URL, or the last segment of a YouTube Shorts URL.

### Add Pastor photo

In `about.html`, replace the emoji avatar div:

```html
<!-- Replace this: -->
<div style="width:120px;height:120px;border-radius:50%;...">👨‍⚖️</div>

<!-- With this: -->
<img src="images/pastor.jpg"
     alt="Pastor A. Karthik Daniel"
     style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--color-gold-border);">
```

### Update deliverance meeting dates

In `index.html`, find the `.grid-4` grid inside "Deliverance Meeting Dates 2026" and update each `.date-card__date` text.

---

## 10. Naming Conventions

### CSS — BEM-style kebab-case

```
.block                     → .site-nav
.block__element            → .site-nav .nav-logo__name
.block--modifier           → .card--gold, .btn--gold, .btn--outline
.is-state                  → .is-active, .is-open, .is-visible
```

**Never use camelCase in CSS class names.**

### JavaScript — camelCase

```js
// Functions
toggleTheme()         // global, called by onclick
toggleMenu()          // global, called by onclick
goTop()               // global, called by onclick
sendViaWhatsApp()     // contact.html only
changeTestimonial()   // events.html only

// Variables
const currentIndex    // not current_index
const testimonials    // not testimonial_list
```

**Never use snake_case in JavaScript.**

### HTML IDs — kebab-case

```html
id="mobile-menu"
id="scroll-top-btn"
id="cd-d"   ← countdown days
id="cd-h"   ← countdown hours
id="cd-m"   ← countdown minutes
id="cd-s"   ← countdown seconds
id="testimonial-text"
id="testimonial-author"
id="cf-name"     ← contact form fields
id="cf-email"
id="cf-phone"
id="cf-subject"
id="cf-msg"
```

---

## 11. Accessibility Notes

- Every `<img>` has an `alt` attribute.
- Navigation has `aria-label="Primary navigation"`.
- The mobile menu has `role="menu"` and each link has `role="menuitem"`.
- The countdown has `role="timer"` and `aria-live="polite"`.
- The hero section has `aria-labelledby` pointing to its heading.
- The WA float and scroll-to-top buttons have `aria-label`.
- The `.sr-only` utility class (used in ministries.html) hides content visually but keeps it for screen readers.
- Emoji used decoratively are wrapped in `aria-hidden="true"` spans.
- All YouTube iframes have a descriptive `title` attribute.
- All external links have `rel="noopener"`.
- `loading="lazy"` is set on all below-fold images and iframes.

---

## Quick Reference Card

```
Change colour       → css/main.css  :root block
Add a section       → HTML file     use existing .card / .section / .grid-* classes
Change JS behaviour → js/site.js    (theme/menu/scroll) OR inline <script> in page
New page            → Copy gallery.html, update title + active nav class
Update phone number → Search 919444345102 in all .html files
Update logo         → Replace images/logo/logo.png
Update hero image   → images/home/slide1.jpg (desktop) / slide2.jpg (mobile)
Add ministry photo  → images/ministries/{youth|women|prayer|worship|children|outreach}.jpg
Add gallery photo   → images/gallery/*.jpg + <figure> in gallery.html
Update YouTube IDs  → Search video ID string in events.html, replace all
Update 2026 dates   → index.html → .grid-4 → .date-card__date text
```
