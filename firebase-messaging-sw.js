import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

const messaging = getMessaging();

async function requestToken() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BJwUefH5Wr--tR2IhPZcMAoZqSeKrZ6aNbqjKaPK5C--oxZG_qQ_WyhNfgukWZtFt15TGdKDmVAeQAUI1dBHKBo'
    });

    if (currentToken) {
      console.log('Token FCM ottenuto:', currentToken);

      // Invio del token al server (se hai un server per gestire le notifiche)
      // Puoi usare una chiamata fetch o XMLHttpRequest per inviare il token al tuo backend
      // Esempio:
      /*
      await fetch('https://example.com/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken })
      });
      */

    } else {
      console.log("Nessun token di registrazione disponibile. Richiedi l'autorizzazione per generarne uno.");
      requestPermission(); // Chiede il permesso all'utente se non è già stato concesso
    }

  } catch (err) {
    console.error("Si è verificato un errore durante il recupero del token:", err);
  }
}

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Permesso per le notifiche concesso');
    await requestToken();
  } else {
    console.log('Permesso per le notifiche negato');
  }
}

// Chiamata alla funzione per ottenere il token o richiedere il permesso
requestToken();