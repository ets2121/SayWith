
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({ debug: false });

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Cache First for Static Assets (App Shell)
// Fast loading of the app itself
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache First for Media (images, videos, audio)
// User wants to load from cache first for speed, even if online.
registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'video' ||
    request.destination === 'audio',
  new CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses (e.g. from R2)
      }),
      new ExpirationPlugin({
        maxEntries: 100, // Keep up to 100 media files
        purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded
      }),
    ],
  })
);

// Network First for API calls and main page navigations
// Ensures data is fresh but provides offline fallback
registerRoute(
  ({ request, url }) =>
    request.destination === 'document' ||
    url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'dynamic-content-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
       new ExpirationPlugin({
        maxEntries: 50,
      }),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
