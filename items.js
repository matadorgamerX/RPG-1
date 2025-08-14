
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginPrompt = document.getElementById('login-prompt');
    const mainContent = document.getElementById('main-content');
    const characterDropdown = document.getElementById('character-dropdown');
    const noCharactersMessage = document.getElementById('no-characters-message');
    const characterContent = document.getElementById('character-content');
    const characterNameDisplay = document.getElementById('character-name-display');
    const addItemButton = document.getElementById('add-item-button');
    const itemsList = document.getElementById('items-list');

    // --- VARIÁVEIS DE ESTADO ---
    let currentUser = null;
    let selectedCharacterId = null;
    let itemsListener = null; // Para cancelar o listener de itens ao mudar de personagem

    // --- INICIALIZAÇÃO DO FIREBASE ---
    // A configuração do Firebase é carregada do firebase-config.js
    const auth = firebase.auth();
    const db = firebase.firestore(); // Usando Firestore para buscar personagens
    const rtdb = firebase.database(); // Usando Realtime Database para itens

    // --- FUNÇÕES DE LÓGICA ---

    /**
     * Carrega a lista de personagens do usuário do Firestore.
     * Popula o dropdown de seleção.
     */
    async function loadCharacters() {
        if (!currentUser) return;

        try {
            const charactersRef = db.collection(`users/${currentUser.uid}/characters`);
            const snapshot = await charactersRef.get();

            characterDropdown.innerHTML = '<option value="">-- Selecione um Herói --</option>';

            if (snapshot.empty) {
                noCharactersMessage.classList.remove('hidden');
                return;
            }
            
            noCharactersMessage.classList.add('hidden');
            snapshot.forEach(doc => {
                const character = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                // Usamos o nome do personagem salvo no documento do Firestore
                option.textContent = character.name || 'Personagem sem nome'; 
                characterDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar personagens:", error);
            noCharactersMessage.textContent = "Erro ao carregar personagens. Tente recarregar a página.";
            noCharactersMessage.classList.remove('hidden');
        }
    }

    /**
     * Mostra ou esconde o conteúdo principal com base no estado de login.
     * @param {boolean} loggedIn - O usuário está logado?
     */
    function toggleMainContent(loggedIn) {
        if (loggedIn) {
            loginPrompt.classList.add('hidden');
            logoutButton.classList.remove('hidden');
            mainContent.classList.remove('hidden');
        } else {
            loginPrompt.classList.remove('hidden');
            logoutButton.classList.add('hidden');
            mainContent.classList.add('hidden');
            characterContent.classList.add('hidden');
        }
    }
    
    /**
     * Mostra os itens do personagem selecionado.
     * @param {DataSnapshot} snapshot - O snapshot dos itens do Firebase RTDB.
     */
    function displayItems(snapshot) {
        itemsList.innerHTML = '';
        if (!snapshot.exists()) {
            itemsList.innerHTML = '<p class="text-center text-gray-400">Este personagem ainda não possui itens.</p>';
            return;
        }

        snapshot.forEach(childSnapshot => {
            const itemId = childSnapshot.key;
            const item = childSnapshot.val();
            const itemElement = document.createElement('div');
            itemElement.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'flex', 'justify-between', 'items-center', 'shadow-md');
            itemElement.innerHTML = `
                <div>
                    <h3 class="text-xl font-bold text-red-400">${item.name} <span class="text-sm font-normal text-gray-400">(${item.quantity}x)</span></h3>
                    <p class="text-gray-300">${item.description || 'Sem descrição.'}</p>
                </div>
                <button data-id="${itemId}" class="delete-item-btn bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">
                    Excluir
                </button>
            `;
            itemsList.appendChild(itemElement);
        });
    }


    /**
     * Adiciona um novo item ao inventário do personagem selecionado.
     */
    async function addItem() {
        const itemName = document.getElementById('itemName').value.trim();
        const itemDescription = document.getElementById('itemDescription').value.trim();
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value, 10);

        if (!itemName || !selectedCharacterId || isNaN(itemQuantity) || itemQuantity < 1) {
            alert("Por favor, preencha o nome do item e a quantidade (pelo menos 1).");
            return;
        }

        const newItem = {
            name: itemName,
            description: itemDescription,
            quantity: itemQuantity,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        try {
            const itemsRef = rtdb.ref(`items/${currentUser.uid}/${selectedCharacterId}`);
            await itemsRef.push(newItem);
            
            // Limpa o formulário
            document.getElementById('itemName').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('itemQuantity').value = '1';
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            alert("Falha ao adicionar o item. Verifique sua conexão e tente novamente.");
        }
    }
    
    /**
     * Deleta um item do inventário do personagem selecionado.
     * @param {string} itemId - O ID do item a ser deletado.
     */
    async function deleteItem(itemId) {
        if (!currentUser || !selectedCharacterId || !itemId) return;

        if (confirm("Tem certeza que deseja excluir este item?")) {
            try {
                const itemRef = rtdb.ref(`items/${currentUser.uid}/${selectedCharacterId}/${itemId}`);
                await itemRef.remove();
            } catch (error) {
                console.error("Erro ao deletar item:", error);
                alert("Falha ao deletar o item.");
            }
        }
    }


    // --- EVENT LISTENERS ---

    // Autenticação
    auth.onAuthStateChanged(user => {
        currentUser = user;
        toggleMainContent(!!user);
        if (user) {
            loadCharacters();
        }
    });

    loginButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(error => console.error("Erro de login:", error));
    });

    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    // Seleção de Personagem
    characterDropdown.addEventListener('change', (e) => {
        selectedCharacterId = e.target.value;

        // Cancela o listener anterior se houver um
        if (itemsListener) {
            itemsListener.off();
        }

        if (selectedCharacterId) {
            characterContent.classList.remove('hidden');
            characterNameDisplay.textContent = characterDropdown.options[characterDropdown.selectedIndex].text;
            
            // Cria um novo listener para os itens do personagem selecionado
            const itemsRef = rtdb.ref(`items/${currentUser.uid}/${selectedCharacterId}`);
            itemsListener = itemsRef.orderByChild('createdAt'); // Ordena por data de criação
            itemsListener.on('value', displayItems, (error) => {
                console.error("Erro ao carregar itens:", error);
                itemsList.innerHTML = `<p class="text-red-500">Erro ao carregar inventário.</p>`;
            });

        } else {
            characterContent.classList.add('hidden');
            itemsList.innerHTML = ''; // Limpa a lista de itens
        }
    });
    
    // Ações de Itens
    addItemButton.addEventListener('click', addItem);
    itemsList.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('delete-item-btn')) {
            const itemId = e.target.dataset.id;
            deleteItem(itemId);
        }
    });
});
