importScripts('firebase-app.js');
importScripts('firebase-messaging.js');

// Configurazione Firebase per il Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyBx_UoPuW9mrnOgl2ymvFLdhc6o942NLO0",
  authDomain: "proposta-canti-54afe.firebaseapp.com",
  projectId: "proposta-canti-54afe",
  storageBucket: "proposta-canti-54afe.appspot.com",
  messagingSenderId: "1026968544457",
  appId: "1:1026968544457:web:62b8ef49599053ef311918",
  measurementId: "G-96G84RLQJ3"
});

// Inizializza Firebase Cloud Messaging
const messaging = firebase.messaging();

// Gestisci le notifiche push in background
messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
