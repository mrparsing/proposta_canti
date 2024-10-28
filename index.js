import { initializeApp } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log("Permesso per le notifiche garantito");
            getMessagingToken();
        } else {
            console.log("Permesso per le notifiche negato");
        }
    } catch (error) {
        console.error("Errore nella richiesta di permesso", error);
    }
}

async function getMessagingToken() {
    try {
        const token = await getToken(messaging, {
            vapidKey: 'BNWgH3H0wYtTullS6HQWgW9Oc79B6_d3i-wNP--UwP_-skGtA4VR3w8U-c0K7bD6jO63-vykpBVYBCQA0sQjxlM'
        });
        console.log("Token FCM:", token);
        // Invia questo token al server per salvare l'abbonamento dell'utente
    } catch (error) {
        console.error("Errore nella generazione del token", error);
    }
}

requestNotificationPermission();

messaging.onBackgroundMessage((payload) => {
    console.log("Notifica ricevuta in background:", payload);
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon
    });
  });
  