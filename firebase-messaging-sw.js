import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx_UoPuW9mrnOgl2ymvFLdhc6o942NLO0",
  authDomain: "proposta-canti-54afe.firebaseapp.com",
  projectId: "proposta-canti-54afe",
  storageBucket: "proposta-canti-54afe.appspot.com",
  messagingSenderId: "1026968544457",
  appId: "1:1026968544457:web:62b8ef49599053ef311918",
  measurementId: "G-96G84RLQJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inizializza Firebase Cloud Messaging
const messaging = firebase.messaging();

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Permesso per le notifiche concesso');
    const token = await messaging.getToken({ vapidKey: 'BJwUefH5Wr--tR2IhPZcMAoZqSeKrZ6aNbqjKaPK5C--oxZG_qQ_WyhNfgukWZtFt15TGdKDmVAeQAUI1dBHKBo' });
    console.log('Token FCM:', token);
    // Invia il token al server (se hai un server per gestire le notifiche)
  } else {
    console.log('Permesso per le notifiche negato');
  }
}

requestPermission().catch(error => console.error('Errore nella richiesta di permesso', error));

// Gestisci le notifiche push in background
messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'  // Sostituisci con l'icona della tua app
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});