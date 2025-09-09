document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'buyer') {
        alert('You must be logged in as a buyer to view this page.');
        window.location.href = 'login.html';
        return;
    }

    const welcomeMessageElement = document.getElementById('welcome-message');
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welcome, ${user.firstName}!`;
    }

    const messagesNotification = document.getElementById('messages-notification');
    function checkNewMessages() {
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const hasNewMessages = conversations.some(conv => 
            (conv.participant1 === user.email && conv.hasNewMessagesForParticipant1) ||
            (conv.participant2 === user.email && conv.hasNewMessagesForParticipant2)
        );
        if (hasNewMessages) {
            messagesNotification.textContent = ' (New)';
        } else {
            messagesNotification.textContent = '';
        }
    }
    checkNewMessages();

    const productGrid = document.getElementById('product-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    const searchInput = document.getElementById('search-input');
    
    function renderProducts(filteredProducts = null) {
        const products = filteredProducts || JSON.parse(localStorage.getItem('products')) || [];
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        const userFavorites = favorites[user.email] || [];
        
        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
            productGrid.innerHTML = '';
            return;
        }

        noProductsMessage.style.display = 'none';
        productGrid.innerHTML = '';

        products.forEach(product => {
            const farmer = registeredUsers.find(u => u.email === product.farmerEmail);
            const farmerName = farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown Farmer';

            const isFavorite = userFavorites.includes(product.id);
            const favoriteButtonText = isFavorite ? 'Favorited' : 'Add to Favorites';
            const favoriteButtonClass = isFavorite ? 'btn-favorite favorited' : 'btn-favorite';

            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">${product.price}</div>
                    <div class="farmer-info">Sold by: ${farmerName}</div>
                    <div class="button-container">
                        <button class="${favoriteButtonClass}" data-product-id="${product.id}">${favoriteButtonText}</button>
                        <button class="btn-action message-btn" data-farmer-email="${product.farmerEmail}">Message Farmer</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    renderProducts();

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });

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
                conversation = {
                    id: Date.now(),
                    participant1: user.email,
                    participant2: farmerEmail,
                    messages: [],
                    hasNewMessagesForParticipant1: false,
                    hasNewMessagesForParticipant2: true,
                };
                conversations.push(conversation);
                localStorage.setItem('conversations', JSON.stringify(conversations));
            }
            
            window.location.href = `messages.html?conversationId=${conversation.id}`;
        }

        if (event.target.classList.contains('btn-favorite')) {
            const productId = event.target.dataset.productId;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
            
            if (!favorites[user.email]) {
                favorites[user.email] = [];
            }
            
            const index = favorites[user.email].indexOf(parseInt(productId));
            if (index > -1) {
                // Product is already a favorite, so remove it
                favorites[user.email].splice(index, 1);
                alert('Product removed from favorites!');
            } else {
                // Product is not a favorite, so add it
                favorites[user.email].push(parseInt(productId));
                alert('Product added to favorites!');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderProducts(); // Re-render the grid to update the button state
        }
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});