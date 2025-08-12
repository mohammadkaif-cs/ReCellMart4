const CACHE_NAME = 'recellmart-cache-v2'; // Version bumped to invalidate old cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/recellmart_logo.png',
  // Add other root assets from the public folder if needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache initial assets:', err);
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Use a Network falling back to cache strategy
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If the fetch is successful, clone it and cache it for future offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails (e.g., offline), serve from the cache
        return caches.match(event.request);
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
    })
  );
});