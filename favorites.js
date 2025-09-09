document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'buyer') {
        alert('You must be logged in as a buyer to view this page.');
        window.location.href = 'login.html';
        return;
    }

    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavoritesMessage = document.getElementById('no-favorites-message');

    function renderFavorites() {
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        const userFavoritesIds = favorites[user.email] || [];
        
        if (userFavoritesIds.length === 0) {
            noFavoritesMessage.style.display = 'block';
            favoritesGrid.innerHTML = '';
            return;
        }

        noFavoritesMessage.style.display = 'none';
        favoritesGrid.innerHTML = '';
        
        userFavoritesIds.forEach(productId => {
            const product = allProducts.find(p => p.id == productId);
            if (product) {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">${product.price}</div>
                        <button class="btn-action remove-favorite-btn" data-product-id="${product.id}">Remove from Favorites</button>
                    </div>
                `;
                favoritesGrid.appendChild(card);
            }
        });
    }

    favoritesGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-favorite-btn')) {
            const productId = event.target.dataset.productId;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
            if (favorites[user.email]) {
                favorites[user.email] = favorites[user.email].filter(id => id != productId);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                alert('Product removed from favorites!');
                renderFavorites(); // Re-render the list after removal
            }
        }
    });

    renderFavorites();

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
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'home.html';
    });
});