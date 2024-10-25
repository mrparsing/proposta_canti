const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configura le chiavi VAPID
webPush.setVapidDetails(
    'mailto:tuo@email.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Endpoint per ricevere la sottoscrizione dal client
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    // Rispondi al client con status 201
    res.status(201).json({});

    // Definisci il payload
    const payload = JSON.stringify({
        title: 'Notifica dalla tua PWA!',
        body: 'Questa è una notifica push!',
        icon: '/icon.png'
    });

    // Invia la notifica
    webPush.sendNotification(subscription, payload)
        .then(() => console.log('Notifica inviata con successo'))
        .catch(error => console.error('Errore invio notifica:', error));
});

// Endpoint per verificare il funzionamento del server
app.get('/', (req, res) => {
    res.send('Server di notifiche push attivo!');
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
