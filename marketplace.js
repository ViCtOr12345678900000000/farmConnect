document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const productGrid = document.getElementById('product-grid');
    const noProductsMessage = document.getElementById('no-products-message');

    function renderProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
            return;
        }

        noProductsMessage.style.display = 'none';
        productGrid.innerHTML = '';

        products.forEach(product => {
            const farmer = registeredUsers.find(u => u.email === product.farmerEmail);
            const farmerName = farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown Farmer';

            let actionButton = '';
            if (user) {
                if (user.email === product.farmerEmail) {
                    actionButton = `<button class="btn-action my-product" disabled>This is My Product</button>`;
                } else {
                    actionButton = `<button class="btn-action message-btn" data-farmer-email="${product.farmerEmail}">Message Farmer</button>`;
                }
            } else {
                actionButton = `<button class="btn-action">Log in to interact</button>`;
            }

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="farmer-info">
                        <p class="farmer-name">Farmer: ${farmerName}</p>
                    </div>
                    <p>${product.description}</p>
                    <div class="price">${product.price}</div>
                    <div class="button-container">
                        ${actionButton}
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    renderProducts();

    // The existing "Message Farmer" button logic remains the same.
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('message-btn')) {
            const farmerEmail = event.target.dataset.farmerEmail;

            const conversations = JSON.parse(localStorage.getItem('conversations')) || [];

            let conversation = conversations.find(conv =>
                (conv.participant1 === user.email && conv.participant2 === farmerEmail) ||
                (conv.participant1 === farmerEmail && conv.participant2 === user.email)
            );

            if (!conversation) {
                const farmer = JSON.parse(localStorage.getItem('registeredUsers')).find(u => u.email === farmerEmail);
                const farmerName = farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown';

                conversation = {
                    id: Date.now(),
                    participant1: user.email,
                    participant2: farmerEmail,
                    name: farmerName,
                    messages: []
                };
                conversations.push(conversation);
                localStorage.setItem('conversations', JSON.stringify(conversations));
            }

            window.location.href = `messages.html?conversationId=${conversation.id}`;
        }
    });
});