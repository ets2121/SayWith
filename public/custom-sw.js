
const CACHE_NAME = 'saywith-cache-v1';
const STATIC_ASSETS_CACHE_NAME = 'static-assets-v1';
const MEDIA_CACHE_NAME = 'media-cache-v1';
const MAX_MEDIA_CACHE_ENTRIES = 100; // Limit for media files

// Assets to cache on installation (app shell)
const staticAssets = [
  '/',
  '/site.webmanifest',
  // Next.js build files will be added to this list by next-pwa
];

// A simple in-memory registry for cache entry usage
const lruRegistry = [];

async function updateLRURegistry(cacheName, requestUrl) {
    const index = lruRegistry.findIndex(entry => entry.url === requestUrl && entry.cache === cacheName);
    if (index > -1) {
        lruRegistry.splice(index, 1);
    }
    lruRegistry.push({ url: requestUrl, cache: cacheName, timestamp: Date.now() });
}

async function cleanupCache(cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // Find entries in the registry that belong to the target cache
    const cacheSpecificRegistry = lruRegistry.filter(entry => entry.cache === cacheName);
    
    if (cacheSpecificRegistry.length > maxEntries) {
        const entriesToDelete = cacheSpecificRegistry.slice(0, cacheSpecificRegistry.length - maxEntries);
        for (const entry of entriesToDelete) {
            console.log(`Cache cleanup: Deleting ${entry.url} from ${cacheName}`);
            await cache.delete(entry.url);
            // Remove from global registry
            const lruIndex = lruRegistry.findIndex(lruEntry => lruEntry.url === entry.url && lruEntry.cache === entry.cache);
            if (lruIndex > -1) {
                lruRegistry.splice(lruIndex, 1);
            }
        }
    }
}


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_ASSETS_CACHE_NAME).then((cache) => {
      return cache.addAll(staticAssets);
    }).catch(error => {
      console.error('Failed to cache static assets:', error);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_ASSETS_CACHE_NAME && cacheName !== MEDIA_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


const handleMediaRequest = async (event) => {
    const cache = await caches.open(MEDIA_CACHE_NAME);
    
    try {
        // Network first
        const networkResponse = await fetch(event.request);
        
        // Check for a valid response to cache
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            // Cache the new response
            event.waitUntil(
              (async () => {
                await cache.put(event.request, responseClone);
                await updateLRURegistry(MEDIA_CACHE_NAME, event.request.url);
                await cleanupCache(MEDIA_CACHE_NAME, MAX_MEDIA_CACHE_ENTRIES);
              })()
            );
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        console.log('Network request failed, falling back to cache for:', event.request.url);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            await updateLRURegistry(MEDIA_CACHE_NAME, event.request.url);
            return cachedResponse;
        }
        // If nothing in cache, the request will fail (which is expected offline behavior)
        return new Response('Network error and not in cache', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
};

const handleStaticAssetRequest = async (event) => {
    const cache = await caches.open(STATIC_ASSETS_CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Fallback to network if not in cache (e.g., for new deployments)
    const networkResponse = await fetch(event.request);
    if(networkResponse.ok) {
       await cache.put(event.request, networkResponse.clone());
    }
    return networkResponse;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore requests to Firebase and other APIs
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
    return;
  }

  // Media files: images, video, audio
  if (/\.(png|jpe?g|gif|svg|webp|mp4|mov|mp3|wav|ogg)$/i.test(url.pathname) || url.hostname.includes('r2.cloudflarestorage.com')) {
    event.respondWith(handleMediaRequest(event));
  }
  // Static assets: JS, CSS, fonts from the same origin
  else if (/\.(js|css)$/i.test(url.pathname) || url.hostname === self.location.hostname) {
    event.respondWith(handleStaticAssetRequest(event));
  }
});

self.addEventListener('message', event => {
  // This is a placeholder for potential future interactivity with the SW
  if (event.data && event.data.action === 'SET_USER') {
    // console.log('Service worker received user ID:', event.data.userId);
  }
});
