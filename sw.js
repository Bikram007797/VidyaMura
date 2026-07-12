// VidyaMura Service Worker
// Purpose: satisfies Chrome/Android's PWA installability requirement
// (a registered service worker with a fetch handler + a valid manifest).
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

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'VidyaMura', {
      body: data.body || '',
      tag: data.tag,
      vibrate: [200, 100, 200],
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
