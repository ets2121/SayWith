// Function to get the base name of a URL (e.g., 'file' from 'file_123.mp3')
const getBaseName = (url) => {
  const fileName = url.substring(url.lastIndexOf('/') + 1);
  const baseName = fileName.split('_')[0];
  return baseName;
};

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

// Message event handler to manage caches
self.addEventListener('message', (event) => {
  const { action, userId, assets } = event.data;

  if (action === 'CACHE_USER_ASSETS') {
    event.waitUntil(handleUserCaching(userId, assets));
  }
});

// Handles caching for a specific user
const handleUserCaching = async (userId, assets) => {
  const cacheName = `user-cache-${userId}`;

  try {
    // Clean up caches for all other users
    const keys = await caches.keys();
    const otherUserCaches = keys.filter(key => key.startsWith('user-cache-') && key !== cacheName);
    await Promise.all(otherUserCaches.map(key => caches.delete(key)));
    
    const cache = await caches.open(cacheName);
    const existingRequests = await cache.keys();
    const existingUrls = existingRequests.map(req => req.url);

    // Identify stale assets to remove
    const staleUrls = existingUrls.filter(url => {
        const base = getBaseName(url);
        return assets.some(assetUrl => getBaseName(assetUrl) === base && assetUrl !== url);
    });

    // Identify assets that are no longer in the list
    const assetsToRemove = existingUrls.filter(url => !assets.includes(url) && !staleUrls.includes(url));
    
    // Remove stale and unused assets
    await Promise.all([...staleUrls, ...assetsToRemove].map(url => cache.delete(url)));

    // Add new assets to cache
    const assetsToCache = assets.filter(url => !existingUrls.includes(url));
    if (assetsToCache.length > 0) {
      await cache.addAll(assetsToCache);
    }
    
  } catch (error) {
    console.error('Service Worker caching failed:', error);
  }
};
