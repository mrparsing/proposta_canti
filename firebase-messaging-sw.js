importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
    measurementId: "G-1W0M5CGBGT"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Messaggio ricevuto in background:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'  // Cambia con il percorso della tua icona
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});