document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://172.20.10.7:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            if (role === 'farmer') {
                window.location.href = 'farmer_dashboard.html';
            } else {
                window.location.href = 'buyer_dashboard.html';
            }
        } else {
            const error = await response.text();
            alert(`Login failed: ${error}`);
        }
    } catch (error) {
        alert('An error occurred. Please ensure your backend server is running.');
    }
});
