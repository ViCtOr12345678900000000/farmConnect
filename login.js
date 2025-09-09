document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(user => user.email === email && user.password === password && user.role === role);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        if (user.role === 'farmer') {
            window.location.href = 'farmer_dashboard.html';
        } else {
            window.location.href = 'buyer_dashboard.html';
        }
    } else {
        alert('Invalid email, password, or role. Please try again or register.');
    }
});