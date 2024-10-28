// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js');

// Configurazione di Firebase per il service worker
firebase.initializeApp({
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
    measurementId: "G-1W0M5CGBGT"
});

const messaging = firebase.messaging();

// Listener per gestire le notifiche
messaging.onBackgroundMessage((payload) => {
    console.log("Messaggio in background ricevuto:", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
