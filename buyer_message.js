document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('You must be logged in to view messages.');
        window.location.href = 'login.html';
        return;
    }

    const messagesContainer = document.querySelector('.messages-container');
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversationId');

    function renderConversation(conv) {
        messagesContainer.innerHTML = '';
        const conversationDiv = document.createElement('div');
        conversationDiv.className = 'conversation';

        const messagesList = document.createElement('div');
        messagesList.className = 'messages-list';

        conv.messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.sender === user.email ? 'sent' : 'received'}`;
            messageElement.textContent = msg.text;
            messagesList.appendChild(messageElement);
        });

        const messageForm = document.createElement('form');
        messageForm.className = 'message-form';
        messageForm.innerHTML = `
            <input type="text" placeholder="Type a message..." required>
            <button type="submit">Send</button>
        `;
        
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = messageForm.querySelector('input');
            const messageText = input.value;
            if (messageText.trim()) {
                const newMessage = {
                    sender: user.email,
                    text: messageText,
                    timestamp: new Date().toISOString()
                };

                const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
                const currentConvIndex = conversations.findIndex(c => c.id == conversationId);
                
                if (currentConvIndex !== -1) {
                    conversations[currentConvIndex].messages.push(newMessage);
                    localStorage.setItem('conversations', JSON.stringify(conversations));
                    renderConversation(conversations[currentConvIndex]);
                }
                input.value = '';
            }
        });

        conversationDiv.appendChild(messagesList);
        conversationDiv.appendChild(messageForm);
        messagesContainer.appendChild(conversationDiv);
    }

    if (conversationId) {
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const currentConv = conversations.find(c => c.id == conversationId);
        if (currentConv) {
            renderConversation(currentConv);
        } else {
            messagesContainer.textContent = 'Conversation not found.';
        }
    } else {
        // Display a list of conversations if no specific conversation is selected
        const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        const userConversations = conversations.filter(conv =>
            conv.participant1 === user.email || conv.participant2 === user.email
        );
        
        if (userConversations.length > 0) {
            const convList = document.createElement('div');
            convList.className = 'conversation-list';
            userConversations.forEach(conv => {
                const otherParticipantEmail = conv.participant1 === user.email ? conv.participant2 : conv.participant1;
                const otherUser = JSON.parse(localStorage.getItem('registeredUsers')).find(u => u.email === otherParticipantEmail);
                const otherUserName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : otherParticipantEmail;

                const convLink = document.createElement('a');
                convLink.href = `buyer_messages.html?conversationId=${conv.id}`;
                convLink.className = 'conversation-link';
                convLink.textContent = `Conversation with ${otherUserName}`;
                convList.appendChild(convLink);
            });
            messagesContainer.appendChild(convList);
        } else {
            messagesContainer.textContent = 'You have no active conversations.';
        }
    }

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});