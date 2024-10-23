const CACHE_NAME = 'v2'; // Aggiorna il numero di versione quando cambi i file da cache
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/styles/style_index.css',
  '/javascript/javascript.js'
];

// Installazione del service worker e caching dei file
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercetta le richieste e risponde con i file dalla cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Aggiornamento del service worker e gestione della cache
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestione dei messaggi per forzare l'installazione del nuovo Service Worker
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notifica di aggiornamento
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Apri la pagina principale
  );
});

// Mostra una notifica quando un nuovo Service Worker è attivo
self.addEventListener('updatefound', function() {
  const newWorker = registration.installing;
  newWorker.onstatechange = function() {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // Invia una notifica all'utente
      self.registration.showNotification('E\' disponibile un nuovo aggiornamento!', {
        body: 'Clicca per ricaricare l\'app.',
        icon: '/icon.png' // Aggiungi un'icona per la notifica
      });
    }
  };
});
