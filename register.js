document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Retrieve existing registered users from local storage or initialize an empty array
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if the user is already registered
    const userExists = registeredUsers.some(user => user.email === email);
    if (userExists) {
        alert('This email is already registered. Please log in.');
        return;
    }

    // Add the new user to the list, including the phone number
    const newUser = { email, role, phone };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html';
});