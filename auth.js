// Initialize Firebase
firebase.auth().onAuthStateChanged(function(user) {
    // --- Common Elements ---
    const logoutButton = document.getElementById('logout-button');
    const userEmailSpan = document.getElementById('user-email');
    const loginLink = document.getElementById('login-link');
    const userInfoDiv = document.getElementById('user-info');

    // --- Page-Specific Elements for items.html ---
    const itemForm = document.getElementById('item-form');
    const itemsListContainer = document.getElementById('items-list-container');
    const loginPrompt = document.getElementById('login-prompt');
    
    if (user) {
        // --- User is signed in. ---

        // Universal login state for main.html and other pages
        if (loginLink) loginLink.classList.add('hidden');
        if (userInfoDiv) {
            userInfoDiv.classList.remove('hidden');
            userInfoDiv.classList.add('flex'); // Ensure it's a flex container
        }
        if (userEmailSpan) userEmailSpan.textContent = user.email;
        if (logoutButton) logoutButton.classList.remove('hidden');

        // Specific logic for items.html
        if (itemForm) itemForm.style.display = 'block';
        if (itemsListContainer) itemsListContainer.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';

        // Initialize items display only if the function exists (for items.html)
        if (typeof initItems === 'function') {
            initItems();
        }
    } else {
        // --- User is signed out. ---
        
        // Universal logout state
        if (loginLink) loginLink.classList.remove('hidden');
        if (userInfoDiv) userInfoDiv.classList.add('hidden');

        // Specific logic for items.html
        if (itemForm) itemForm.style.display = 'none';
        if (itemsListContainer) itemsListContainer.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'block';
    }
});

/**
 * Signs the user in with Google.
 */
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(function(error) {
        console.error("Authentication Error:", error);
    });
}

/**
 * Signs the user out.
 */
function signOut() {
    firebase.auth().signOut().then(() => {
        // This ensures the page reloads after logout, redirecting if necessary.
        window.location.reload(); 
    });
}
