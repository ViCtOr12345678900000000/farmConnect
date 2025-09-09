document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'farmer') {
        alert('You must be logged in as a farmer to view this page.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('add-product-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const imageFile = document.getElementById('image').files[0];

        if (!productName || !description || !price || !imageFile) {
            alert('Please fill in all fields.');
            return;
        }

        // Use FileReader to read the image and store it as a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;

            // Get existing products from local storage
            const products = JSON.parse(localStorage.getItem('products')) || [];
            
            // Create a new product object
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                name: productName,
                description: description,
                price: price,
                image: imageDataUrl,
                farmerEmail: user.email // Associate product with the logged-in farmer
            };

            // Add the new product to the array
            products.push(newProduct);

            // Save the updated products array back to local storage
            localStorage.setItem('products', JSON.stringify(products));

            alert('Product added successfully!');
            window.location.href = 'farmer_dashboard.html';
        };
        reader.readAsDataURL(imageFile);
    });
});