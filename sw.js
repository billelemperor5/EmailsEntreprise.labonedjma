const CACHE_NAME = 'labo-nedjma-pwa-v6.0.5';
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=6.0.5',
  './mobile.css?v=6.0.5',
  './indexeddb.js?v=6.0.5',
  './script.js?v=6.0.5',
  './manifest.webmanifest',
  './assets/system-background.png',
  './assets/logo.png',
  './assets/system-logo.png',
  './assets/favicon_circle.png',
  './assets/pwa/icon-192.png',
  './assets/pwa/icon-512.png',
  './assets/pwa/apple-touch-icon.png'
];

function cacheValidResponse(event, request, response) {
  if (!response || (!response.ok && response.type !== 'opaque')) return;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for versioned app files and CDN resources, with cached fallback.
  // This keeps updates fresh online while preserving the PWA shell offline.
  if (url.search.includes('v=') || url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          cacheValidResponse(event, event.request, response);
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network-first for HTML so users receive the newest script/style URLs.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          cacheValidResponse(event, './index.html', response);
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for static assets (images, icons, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          cacheValidResponse(event, event.request, response);
          return response;
        })
        .catch(() => caches.match(event.request));
    })
  );
});
