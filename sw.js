// VidyaMura Service Worker
// Purpose: satisfies Chrome/Android's PWA installability requirement
// (a registered service worker with a fetch handler + a valid manifest).
// Keeps things simple: just passes requests through to the network.

const CACHE_NAME = 'vidyamura-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
