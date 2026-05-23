// ═══════════════════════════════════════════════════════════════
//  ENJC Service Worker — Offline-first PWA  (fixed v2)
//  Caches shell + static assets; Bible data stays fresh from network
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'enjc-v2';
const DATA_CACHE = 'enjc-data-v2';

// Static shell — cache on install, serve from cache always
const SHELL_ASSETS = [
  '/church/',
  '/church/index.html',
  '/church/about.html',
  '/church/bible.html',
  '/church/contact.html',
  '/church/events.html',
  '/church/gallery.html',
  '/church/imagegen.html',
  '/church/ministries.html',
  '/church/manifest.json',
  '/church/css/main.css',
  '/church/css/mobile-ux-fixes.css',
  '/church/css/enjc-premium.css',
  '/church/css/design-upgrade.css',
  '/church/css/imagegen.css',
  '/church/css/events.css',
  '/church/js/site.js',
  '/church/js/bible.js',
  '/church/js/events.js',
  '/church/js/gallery.js',
  '/church/js/live-stream.js',
  '/church/js/mobile-ux-fixes.js',
  '/church/js/design-upgrade.js',
  '/church/js/premium-upgrade.js',
  '/church/js/imagegen-main.js',
  '/church/js/imagegen-ui.js',
  '/church/js/imagegen-canvas.js',
  '/church/js/imagegen-data.js',
  '/church/js/imagegen-export.js',
  '/church/data/bible-data.json',
  '/church/data/bible-topics.json',
  '/church/data/book_index.json',
  '/church/data/events.json',
  '/church/data/tamil-bible.json',
  '/church/images/logo/logo.png',
  '/church/images/home/slide1.webp',
  '/church/images/home/slide2.webp',
  '/church/images/pastor.jpg',
];

// ── INSTALL — pre-cache shell ────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll fails if ANY asset 404s — use individual puts so one missing
      // image doesn't break the whole install
      return Promise.allSettled(
        SHELL_ASSETS.map(url =>
          fetch(url).then(res => {
            if (res.ok) cache.put(url, res);
          }).catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE — clean up old caches ──────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== DATA_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — cache-first for shell, network-first for Bible data ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin API calls (YouTube, Bible APIs, fonts)
  if (request.method !== 'GET') return;
  if (url.hostname !== 'elimnewjerusalem.github.io' &&
      url.hostname !== location.hostname) return;

  // Bible data: network-first, fall back to cache (keeps content fresh)
  if (url.pathname.includes('/data/english_kjv') ||
      url.pathname.includes('/data/tamil_full')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(cache =>
        fetch(request)
          .then(res => { cache.put(request, res.clone()); return res; })
          .catch(() => cache.match(request))
      )
    );
    return;
  }

  // Everything else: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/church/index.html');
        }
      });
    })
  );
});
