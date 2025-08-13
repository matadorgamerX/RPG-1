// Initialize Firebase
firebase.auth().onAuthStateChanged(function(user) {
    const itemForm = document.getElementById('item-form');
    const itemsList = document.getElementById('items-list-container');
    const loginPrompt = document.getElementById('login-prompt');
    const logoutButton = document.getElementById('logout-button');

    if (user) {
        // User is signed in.
        itemForm.style.display = 'block';
        itemsList.style.display = 'block';
        loginPrompt.style.display = 'none';
        logoutButton.style.display = 'block';

        // Initialize items display
        initItems();
    } else {
        // User is signed out.
        itemForm.style.display = 'none';
        itemsList.style.display = 'none';
        loginPrompt.style.display = 'block';
        logoutButton.style.display = 'none';
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
