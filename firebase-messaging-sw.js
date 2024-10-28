importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


console.log("test sw");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const firebaseConfig = {
    apiKey: "AIzaSyAKG4mi3DGhomBo989PHUilHYW-PF-akzI",
    authDomain: "proposta-canti-13252.firebaseapp.com",
    projectId: "proposta-canti-13252",
    storageBucket: "proposta-canti-13252.appspot.com",
    messagingSenderId: "643920970942",
    appId: "1:643920970942:web:5351c41cc6068558a48aef",
};


function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
            const app = initializeApp(firebaseConfig)
            // Retrieve an instance of Firebase Messaging so that it can handle background
            // messages.
            const messaging = getMessaging(app)

            getToken(messaging, { vapidKey: 'BNWgH3H0wYtTullS6HQWgW9Oc79B6_d3i-wNP--UwP_-skGtA4VR3w8U-c0K7bD6jO63-vykpBVYBCQA0sQjxlM' }).then((currentToken) => {
                if (currentToken) {
                    console.log('currentToken', currentToken);
                } else {
                    console.log('Can not get token');
                }
            });
        } else {
            console.log('Do not have permission');
        }
    })
}

requestPermission()