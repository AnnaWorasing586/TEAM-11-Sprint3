// Minimal app-shell service worker. Caches static assets so the prototype
// keeps rendering after first load even without network. API calls bypass
// the cache so AI scans always hit the live backend.

const CACHE = 'nutriscan-v3';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

// Network-first for the app shell so updates show on the next reload.
// Falls back to cache only when offline / fetch fails.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/api/')) return;
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then((resp) => {
      if (resp && resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE).then((c) => c.put(event.request, clone));
      }
      return resp;
    }).catch(() => caches.match(event.request)),
  );
});
