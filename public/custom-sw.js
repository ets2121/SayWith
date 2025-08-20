
if (typeof self !== 'undefined') {
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

  if (workbox) {
    const { registerRoute } = workbox.routing;
    const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
    const { ExpirationPlugin } = workbox.expiration;
    const { CacheableResponsePlugin } = workbox.cacheableResponse;

    // Cache static assets (JS, CSS, fonts, etc.) with a CacheFirst strategy
    registerRoute(
      ({ request }) =>
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font',
      new CacheFirst({
        cacheName: 'static-assets-cache',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );

    // Caching strategy for media (images, videos, audio) using Stale-While-Revalidate
    registerRoute(
      ({ request }) =>
        request.destination === 'image' ||
        request.destination === 'video' ||
        request.destination === 'audio',
      new StaleWhileRevalidate({
        cacheName: 'media-cache',
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200], // Cache opaque responses (for cross-origin resources) and standard successful responses
          }),
          new ExpirationPlugin({
            maxEntries: 100, // Maximum number of media files to cache
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded
          }),
        ],
      })
    );
  }
}
