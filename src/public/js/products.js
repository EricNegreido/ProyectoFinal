document.addEventListener('DOMContentLoaded', function (){
    
    // Add Product Button
        const addToCartButtons = document.querySelectorAll('button[productId]');
        const cartId = document.getElementById('cartId').value;
        addToCartButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const productId = button.getAttribute('productId');
                const quantityInputId = `#quantityProduct_${productId}`;
                const quantity = document.querySelector(quantityInputId).value;
                fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity }),
                }).then(response => {
                    if (response.ok) {
                        console.log(`Product with ID ${productId} added to the cart for user ${cartId}`);
                    } else {
                        console.error('Error adding product to the cart');
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            });
        });
});