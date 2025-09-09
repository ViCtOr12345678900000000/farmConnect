document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert('You must be logged in to view your account details.');
        window.location.href = 'login.html';
        return;
    }

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');

    if (firstNameInput && lastNameInput && emailInput && roleInput) {
        firstNameInput.value = user.firstName || '';
        lastNameInput.value = user.lastName || '';
        emailInput.value = user.email || '';
        roleInput.value = user.role || '';
    }
});