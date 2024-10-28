const CACHE_NAME = 'v2'; // Update the version number when caching files
const urlsToCache = [
  'index.html',
  'manifest.json',
  'styles/style_index.css',
  'javascript/javascript.js'
];

// Installation of the service worker and caching files
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept requests and respond with cached files
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Update service worker and manage the cache
self.addEventListener('activate', function (event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Claim clients for the new service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});