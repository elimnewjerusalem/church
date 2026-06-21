// ═══════════════════════════════════════════════════════════════
//  ENJC Website — Service Worker (offline shell cache)
//  Scope: website only (Home, About, Ministries, Events, Gallery, Contact)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'enjc-site-v1';

// Static shell — cache on install, serve from cache always.
// Paths are relative to this file's scope (registered at site root).
const SHELL_ASSETS = [
  './',
  'index.html',
  'about.html',
  'ministries.html',
  'events.html',
  'gallery.html',
  'contact.html',
  '404.html',
  'data/manifest.json',
  'data/events.json',
  'css/main.css',
  'css/pages.css',
  'css/design-system.css',
  'css/premium-v2.css',
  'css/mobile-fix.css',
  'js/site.js',
  'js/design-upgrade.js',
  'js/events.js',
  'js/live-stream.js',
  'images/logo/logo.png',
];

// ── INSTALL — pre-cache shell ────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Use individual puts so one missing/renamed asset doesn't break install
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
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — cache-first for shell, network fallback ──────────
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return; // skip cross-origin (YouTube, fonts, etc.)

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
          return caches.match('index.html');
        }
      });
    })
  );
});
