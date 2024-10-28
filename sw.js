const CACHE_NAME = 'v2'; // Aggiorna il numero di versione quando cambi i file da cache
const urlsToCache = [
  'index.html',
  'manifest.json',
  'styles/style_index.css',
  'javascript/javascript.js'
];

// Installazione del service worker e caching dei file
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercetta le richieste e risponde con i file dalla cache
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Controlla se la richiesta è in cache, altrimenti effettua una richiesta di rete
      return response || fetch(event.request);
    })
  );
});

// Aggiornamento del service worker e gestione della cache
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

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forza l'attivazione del nuovo Service Worker
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Assicura che il nuovo SW prenda il controllo
});

// Invia un messaggio al client quando l'installazione è completata
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});



importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


console.log("test sw");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
  authDomain: "proposta-canti-13252.firebaseapp.com",
  projectId: "proposta-canti-13252",
  storageBucket: "proposta-canti-13252.appspot.com",
  messagingSenderId: "643920970942",
  appId: "1:643920970942:web:5351c41cc6068558a48aef",
};


function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted');
      const app = initializeApp(firebaseConfig)
      // Retrieve an instance of Firebase Messaging so that it can handle background
      // messages.
      const messaging = getMessaging(app)

      getToken(messaging, { vapidKey: 'BNWgH3H0wYtTullS6HQWgW9Oc79B6_d3i-wNP--UwP_-skGtA4VR3w8U-c0K7bD6jO63-vykpBVYBCQA0sQjxlM' }).then((currentToken) => {
        if (currentToken) {
          console.log('currentToken', currentToken);
        } else {
          console.log('Can not get token');
        }
      });
    } else {
      console.log('Do not have permission');
    }
  })
}

requestPermission()