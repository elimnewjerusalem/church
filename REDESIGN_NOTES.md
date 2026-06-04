# ENJC Website — Premium Redesign

## What Changed

### New File: `css/design-system.css`
A comprehensive design upgrade layer that enhances main.css + pages.css without breaking anything.

**Key upgrades:**
- Warmer, more refined gold palette (`#c8a45a` instead of harsh neon gold)
- Premium dark background tones (deeper navy blues)
- Better typography — tighter letter-spacing on headings, improved line-heights
- Grain texture overlay on body for depth and atmosphere
- Scrolled nav state (becomes more opaque on scroll)
- Hero entrance animations (fade-up stagger on each element)
- Enhanced card hover effects — subtle gold border glow
- Premium button shadows and transitions
- Improved form field styling with focus glow
- Gallery hover zoom + filter enhancements
- Scroll-triggered counter animations for stats (about page)
- Better mobile nav — slide-in padding on hover
- Premium footer with link transform on hover
- Scroll-top button, WhatsApp float enhancements
- Scrollbar styling
- Selection highlight color
- Print styles

### New/Upgraded File: `js/design-upgrade.js`
- Nav scrolled state detection
- IntersectionObserver-based reveal animations
- Stat counter animations (about page)
- Lighthouse-safe hamburger with keyboard/escape support
- Countdown timer for next Sunday service
- Lightbox keyboard navigation (← → Escape)
- Gallery category filter support
- Theme persistence via localStorage
- Lazy image fade-in

## What's Preserved
- All page content (HTML unchanged structurally)
- All functionality (Bible reader, Image Generator, Events, etc.)
- All external scripts and APIs
- Existing CSS variables (augmented, not removed)
- Dark/light theme toggle

## Design Direction
**Refined Sacred Luxury** — the site now reads like a premium international ministry brand:
- Less glowing, more glowing-*within* (subtle radial gradients)
- Warmer gold that reads as heritage, not neon
- Tighter, more editorial typography
- More breathing room in components
- Sophisticated hover choreography
