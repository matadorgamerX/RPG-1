
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
});

const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
});
