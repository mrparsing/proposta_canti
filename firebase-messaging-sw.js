importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

console.log("test sw");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
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