// Initialize Firebase
firebase.auth().onAuthStateChanged(function(user) {
    const itemForm = document.getElementById('item-form');
    const itemsList = document.getElementById('items-list-container');
    const loginPrompt = document.getElementById('login-prompt');
    const logoutButton = document.getElementById('logout-button');

    if (user) {
        // User is signed in.
        if (itemForm) itemForm.style.display = 'block';
        if (itemsList) itemsList.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';

        // Initialize items display only if the function exists
        if (typeof initItems === 'function') {
            initItems();
        }
    } else {
        // User is signed out.
        if (itemForm) itemForm.style.display = 'none';
        if (itemsList) itemsList.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
});

// Sign-in with Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(function(error) {
        console.error("Erro de autenticação:", error);
    });
}

// Sign out
function signOut() {
    firebase.auth().signOut();
}
