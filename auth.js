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

document.addEventListener('DOMContentLoaded', () => {
    // --- Login Form Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Login successful:', userCredential.user);
                    window.location.href = 'main.html';
                })
                .catch((error) => {
                    console.error('Login error:', error.code, error.message);
                    alert(`Erro no login: ${error.message}`);
                });
        });
    }

    // --- Signup Form Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Signup successful:', userCredential.user);
                    alert('Cadastro realizado com sucesso! Redirecionando...');
                    window.location.href = 'main.html';
                })
                .catch((error) => {
                    console.error('Signup error:', error.code, error.message);
                    alert(`Erro no cadastro: ${error.message}`);
                });
        });
    }

    // --- Auth State Observer ---
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userInfo && userEmail && loginLink && logoutButton) {
                userEmail.textContent = user.email;
                userInfo.classList.remove('hidden');
                loginLink.classList.add('hidden');
            }
        } else {
            // User is signed out
            if (userInfo && loginLink) {
                userInfo.classList.add('hidden');
                loginLink.classList.remove('hidden');
            }
        }
    });

    // --- Logout Button Logic ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log('User signed out');
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        });
    }
});
