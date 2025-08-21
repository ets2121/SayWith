
const CACHE_VERSION = 'v1';
const CACHEABLE_EXTENSIONS = /\.(mp3|mp4|wav|ogg|jpg|jpeg|png|gif|webp)$/;

let currentUserId = null;
 
function getCacheName(userId) {
  return `media-cache-${CACHE_VERSION}-${userId}`;
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Clean up old versioned caches
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // This filter keeps caches that are not media caches OR are for the current version
              const isMediaCache = cacheName.startsWith('media-cache-');
              const isOutdated = isMediaCache && !cacheName.startsWith(`media-cache-${CACHE_VERSION}`);
              return isOutdated;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'SET_USER') {
    const newUserId = event.data.userId;
    if (currentUserId && currentUserId !== newUserId) {
      console.log(`[SW] User changed from ${currentUserId} to ${newUserId}. Clearing old cache.`);
      const oldCacheName = getCacheName(currentUserId);
      caches.delete(oldCacheName).then(() => {
        console.log(`[SW] Deleted cache: ${oldCacheName}`);
      });
    }
    currentUserId = newUserId;
    console.log(`[SW] Current user set to: ${currentUserId}`);
  }
});


self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests for specified file types, and only if a user is set
  if (event.request.method !== 'GET' || !currentUserId || !CACHEABLE_EXTENSIONS.test(url.pathname)) {
    return;
  }
  
  event.respondWith(
    caches.open(getCacheName(currentUserId)).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        console.log(`[SW] Cache HIT for: ${event.request.url}`);
        return cachedResponse;
      }

      console.log(`[SW] Cache MISS for: ${event.request.url}. Fetching from network.`);
      
      try {
        const networkResponse = await fetch(event.request);

        if (networkResponse.ok) {
          // Response can only be used once, so we need to clone it
          const responseToCache = networkResponse.clone();
          
          // Clean up old versions of the same file before caching the new one
          const baseFileName = url.pathname.split('/').pop().split('_')[0];
          const keys = await cache.keys();
          const oldFilePromises = keys
            .filter(req => req.url.includes(baseFileName) && req.url !== event.request.url)
            .map(req => {
               console.log(`[SW] Deleting old file: ${req.url}`);
               return cache.delete(req);
            });
          
          await Promise.all(oldFilePromises);

          // Cache the new response
          console.log(`[SW] Caching new resource: ${event.request.url}`);
          await cache.put(event.request, responseToCache);
        }

        return networkResponse;
      } catch (error) {
        console.error(`[SW] Fetch failed for: ${event.request.url}`, error);
        // Optional: return a fallback offline response
        // return new Response("Network error occurred", {
        //   status: 408,
        //   headers: { "Content-Type": "text/plain" },
        // });
      }
    })
  );
});
