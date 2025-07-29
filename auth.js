// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-awoLK4cc0XtLtNppibqgYnNLclUeeI4",
    authDomain: "kuar-tor-portal.firebaseapp.com",
    projectId: "kuar-tor-portal",
    storageBucket: "kuar-tor-portal.firebasestorage.app",
    messagingSenderId: "438781244189",
    appId: "1:438781244189:web:99ea6a25fc459b14f567f4",
    measurementId: "G-X5GTEY10VZ"
};

// Initialize only if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
