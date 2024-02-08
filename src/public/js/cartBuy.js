document.addEventListener('DOMContentLoaded', function () {
    const buyButton = document.getElementById('buyButton');

    if (buyButton) {
        buyButton.addEventListener('click', async function () {

            const cartsId = buyButton.getAttribute('data-cartsId');
            await fetch(`/api/carts/${cartsId}/purchaser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        });
    }
});