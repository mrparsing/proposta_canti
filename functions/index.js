/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
    const token = req.body.token; // Assicurati che il token venga inviato nel corpo della richiesta
    const message = {
        notification: {
            title: "Titolo della notifica",
            body: "Corpo della notifica",
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Notifica inviata con successo:', response);
        res.status(200).send("Notifica inviata con successo!");
    } catch (error) {
        console.error('Errore nell\'invio della notifica:', error);
        res.status(500).send("Errore nell'invio della notifica.");
    }
});