// Initialize Firebase
const database = firebase.database();

// Function to add a new item
function addItem() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Você precisa estar logado para adicionar itens.");
        return;
    }

    const itemName = document.getElementById('itemName').value;
    const itemOwner = document.getElementById('itemOwner').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemQuantity = document.getElementById('itemQuantity').value;

    if (itemName && itemOwner) {
        const newItem = {
            name: itemName,
            owner: itemOwner,
            description: itemDescription,
            quantity: itemQuantity,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref('users/' + user.uid + '/items').push(newItem);

        // Clear form fields
        document.getElementById('itemName').value = '';
        document.getElementById('itemOwner').value = '';
        document.getElementById('itemDescription').value = '';
        document.getElementById('itemQuantity').value = '1';
    } else {
        alert("Por favor, preencha o nome e o personagem do item.");
    }
}

// Function to display items
function displayItems(userId) {
    const itemsRef = database.ref('users/' + userId + '/items');
    const itemsList = document.getElementById('items-list');

    itemsRef.on('value', (snapshot) => {
        itemsList.innerHTML = '';
        const items = snapshot.val();
        if (items) {
            Object.keys(items).forEach((key) => {
                const item = items[key];
                const itemElement = document.createElement('div');
                itemElement.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'flex', 'justify-between', 'items-center');
                itemElement.innerHTML = `
                    <div>
                        <h3 class="text-xl font-bold text-red-400">${item.name} <span class="text-sm font-normal text-gray-400">(${item.quantity}x)</span></h3>
                        <p class="text-gray-300"><strong>Personagem:</strong> ${item.owner}</p>
                        <p class="text-gray-300">${item.description}</p>
                    </div>
                    <button onclick="deleteItem('${key}')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Excluir
                    </button>
                `;
                itemsList.appendChild(itemElement);
            });
        } else {
            itemsList.innerHTML = '<p class="text-center text-gray-400">Nenhum item cadastrado ainda.</p>';
        }
    });
}

// Function to delete an item
function deleteItem(itemId) {
    const user = firebase.auth().currentUser;
    if (user) {
        database.ref('users/' + user.uid + '/items/' + itemId).remove();
    }
}

// Function to initialize the items display when a user logs in
function initItems() {
    const user = firebase.auth().currentUser;
    if (user) {
        displayItems(user.uid);
    }
}