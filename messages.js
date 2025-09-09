document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const conversationList = document.getElementById('conversations-ul');
    const noConversationsMessage = document.getElementById('no-conversations-message');
    const messageHistory = document.getElementById('message-history');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const mediaInput = document.getElementById('media-input');
    const chatPartnerNameElement = document.getElementById('chat-partner-name');

    let currentConversationId = null;

    const mockConversations = [
        { id: 1, name: 'Farmer John' },
        { id: 2, name: 'Buyer Jane' },
    ];
    const mockMessages = {
        1: [
            { sender: 'self', type: 'text', content: 'Hi John, are the apples still available?' },
            { sender: 'other', type: 'text', content: 'Yes, they are! How many pounds do you need?' }
        ],
        2: [
            { sender: 'self', type: 'text', content: 'Hey Jane, your order is ready for pickup.' },
            { sender: 'other', type: 'media', content: 'https://via.placeholder.com/200?text=Order+Ready' }
        ]
    };

    function renderConversations() {
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const userConversations = conversations.filter(conv => conv.participant1 === user.email || conv.participant2 === user.email);

        conversationList.innerHTML = '';
        if (userConversations.length === 0) {
            noConversationsMessage.style.display = 'block';
        } else {
            noConversationsMessage.style.display = 'none';
            userConversations.forEach(conv => {
                const otherUserEmail = conv.participant1 === user.email ? conv.participant2 : conv.participant1;
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
                const otherUser = registeredUsers.find(u => u.email === otherUserEmail);
                const conversationName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User';

                const li = document.createElement('li');
                li.textContent = conversationName;
                li.dataset.id = conv.id;
                li.addEventListener('click', () => {
                    currentConversationId = conv.id;
                    renderMessages(currentConversationId, conversationName);
                });
                conversationList.appendChild(li);
            });
        }
    }

    function renderMessages(conversationId, chatPartnerName) {
        messageHistory.innerHTML = '';
        chatPartnerNameElement.textContent = chatPartnerName;
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const conversation = conversations.find(c => c.id == conversationId);
        const messages = conversation ? conversation.messages : [];

        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.sender === user.email ? 'sent' : 'received'}`;

            if (msg.type === 'text') {
                msgDiv.textContent = msg.content;
            } else if (msg.type === 'media' && msg.content) {
                const mediaElement = document.createElement(msg.contentType.startsWith('image') ? 'img' : 'video');
                mediaElement.src = msg.content;
                mediaElement.controls = true;
                if (mediaElement.tagName === 'IMG') {
                    mediaElement.style.maxWidth = '100%';
                    mediaElement.style.height = 'auto';
                }
                msgDiv.appendChild(mediaElement);
            }
            messageHistory.appendChild(msgDiv);
        });

        messageHistory.scrollTop = messageHistory.scrollHeight;
    }

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = messageInput.value.trim();
        const mediaFile = mediaInput.files[0];

        if (!text && !mediaFile) return;

        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const conversation = conversations.find(c => c.id == currentConversationId);

        if (text) {
            const newMessage = { sender: user.email, type: 'text', content: text };
            conversation.messages.push(newMessage);
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }

        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newMessage = {
                    sender: user.email,
                    type: 'media',
                    content: e.target.result,
                    contentType: mediaFile.type
                };
                conversation.messages.push(newMessage);
                localStorage.setItem('conversations', JSON.stringify(conversations));
                renderMessages(currentConversationId, chatPartnerNameElement.textContent);
            };
            reader.readAsDataURL(mediaFile);
        }

        messageInput.value = '';
        mediaInput.value = '';
        renderMessages(currentConversationId, chatPartnerNameElement.textContent);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialConversationId = urlParams.get('conversationId');
    if (initialConversationId) {
        currentConversationId = initialConversationId;
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const conversation = conversations.find(c => c.id == initialConversationId);
        if (conversation) {
            const otherUserEmail = conversation.participant1 === user.email ? conversation.participant2 : conversation.participant1;
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            const otherUser = registeredUsers.find(u => u.email === otherUserEmail);
            const conversationName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User';
            renderMessages(currentConversationId, conversationName);
        }
    }

    renderConversations();
});