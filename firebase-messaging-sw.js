// Importa i moduli Firebase
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js");

// Configura Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
    measurementId: "G-1W0M5CGBGT"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Ottieni un'istanza di Firebase Messaging
const messaging = firebase.messaging();

// Gestisce le notifiche in arrivo in background
messaging.onBackgroundMessage((payload) => {
    console.log("Messaggio in background ricevuto:", payload);

    // Estrai il titolo e il corpo dalla notifica
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    // Mostra la notifica
    self.registration.showNotification(notificationTitle, notificationOptions);
});