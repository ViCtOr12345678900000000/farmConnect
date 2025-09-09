document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'farmer') {
        alert('You must be logged in as a farmer to view this page.');
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

    // The rest of your existing code for farmer_dashboard.js
    const productsTableBody = document.querySelector('#products-table tbody');

    function renderProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsTableBody.innerHTML = '';
        products.filter(p => p.farmerEmail === user.email).forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
            `;
            productsTableBody.appendChild(row);
        });
    }

    renderProducts();

    document.getElementById('add-product-btn').addEventListener('click', function() {
        window.location.href = 'add_product.html';
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});