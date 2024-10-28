const firebaseConfig = {
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
    measurementId: "G-1W0M5CGBGT"
};
// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = firebase.messaging();

// Register the Service Worker and set up Firebase Messaging
if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker
        .register("firebase-messaging-sw.js")
        .then((swReg) => {
            console.log("Service Worker registered:", swReg);

            // Request permission for notifications and retrieve the token
            requestNotificationPermission();

            // Setup handler for messages when the app is in the foreground
            messaging.onMessage((payload) => {
                console.log("Message received:", payload);
                const notificationTitle = payload.notification.title;
                const notificationOptions = {
                    body: payload.notification.body,
                };
                new Notification(notificationTitle, notificationOptions);
            });
        })
        .catch((error) => {
            console.error("Service Worker registration error:", error);
        });
} else {
    console.warn("Push messaging is not supported in this browser.");
}

// Function to request notification permissions and retrieve the FCM token
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log("Notification permission granted.");
            const token = await messaging.getToken({
                vapidKey: 'BNWgH3H0wYtTullS6HQWgW9Oc79B6_d3i-wNP--UwP_-skGtA4VR3w8U-c0K7bD6jO63-vykpBVYBCQA0sQjxlM'
            });
            console.log("FCM Token:", token);
            // Send token to the server if necessary
        } else {
            console.error("Notification permission not granted.");
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }
}