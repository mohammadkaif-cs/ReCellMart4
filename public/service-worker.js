const CACHE_NAME = 'recellmart-cache-v3'; // Version bumped to invalidate old cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/recellmart_logo.png',
];

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients immediately.
  );
});

self.addEventListener('fetch', (event) => {
  // For navigation requests, use a network-first strategy.
  // This ensures users always get the latest HTML.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If the network fails, serve the cached index.html as a fallback.
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For non-navigation requests (assets), use a cache-first strategy (Stale-While-Revalidate).
  // This makes the app load faster by serving assets from the cache.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we have a cached response, return it.
        // In the background, fetch a new version and update the cache.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
        // Return cached response immediately, if available.
        return response || fetchPromise;
      })
  );
});