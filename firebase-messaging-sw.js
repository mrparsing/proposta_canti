importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDYz8EaEkVyJd7bnYZ8-H1s8xFkiK2r_W8",
    authDomain: "proposta-canti-ac08f.firebaseapp.com",
    projectId: "proposta-canti-ac08f",
    storageBucket: "proposta-canti-ac08f.appspot.com",
    messagingSenderId: "276630792311",
    appId: "1:276630792311:web:48b80198bf8dd9a7037e72",
    measurementId: "G-MSY5GJVWLQ"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Gestione delle notifiche in background
messaging.onBackgroundMessage(function(payload) {
  console.log('Messaggio in background ricevuto: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
