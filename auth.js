// These functions are defined in the global scope so that the 'onclick' attributes
// in the HTML can find and execute them.
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // On successful login, redirect to the main portal.
            window.location.href = 'main.html';
        })
        .catch(function(error) {
            console.error("Authentication Error:", error);
            alert("Ocorreu um erro durante o login: " + error.message);
        });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        // After signing out, reload the page. The onAuthStateChanged listener will handle the UI update.
        window.location.reload(); 
    });
}


// This listener ensures that the code inside only runs after the page is fully loaded
// and Firebase has been initialized by firebase-config.js.
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined') {
        console.error("Firebase não foi inicializado. Verifique se firebase-config.js está sendo carregado corretamente antes de auth.js.");
        // Display an error to the user on the page itself
        const body = document.querySelector('body');
        if(body) {
            body.innerHTML = '<div style="color: red; text-align: center; padding: 2rem;">Erro Crítico: A conexão com os serviços de autenticação falhou. Verifique a consola para mais detalhes.</div>';
        }
        return;
    }

    const auth = firebase.auth();

    // This is the core logic that checks if a user is logged in or not and updates the UI.
    auth.onAuthStateChanged(function(user) {
        // Elements that might exist on various pages
        const userInfoDiv = document.getElementById('user-info');
        const userEmailSpan = document.getElementById('user-email');
        const loginLink = document.getElementById('login-link');
        const logoutButtonInUserInfo = userInfoDiv ? userInfoDiv.querySelector('#logout-button') : null;

        // --- Handle UI for Logged-In vs. Logged-Out Users ---
        if (user) {
            // User is signed in.
            // Hide the main login button/link
            if (loginLink) loginLink.style.display = 'none';
            
            // Show the user info block
            if (userInfoDiv) {
                userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;
                if (logoutButtonInUserInfo) logoutButtonInUserInfo.style.display = 'block';
            }

        } else {
            // User is signed out.
            // Show the main login button/link
            if (loginLink) loginLink.style.display = 'block';

            // Hide the user info block
            if (userInfoDiv) {
                userInfoDiv.style.display = 'none';
            }
        }
    });
});
