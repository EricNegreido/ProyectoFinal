function updateUserStatus() {
    // Obtener el estado actual del usuario
    const userStatusElement = document.getElementById('userStatus');
    // const currentStatus = userStatusElement.innerText.toLowerCase();

    // Verificar si se seleccionó la casilla de verificación de premium
    const premiumCheckbox = document.getElementById('premiumCheckbox');
    // const newStatus = premiumCheckbox.checked && userStatusElement === 'User' ? 'Premium' : 'User';
    const userId = document.getElementById('userId').value;
    const newStatus = (premiumCheckbox.checked && userStatusElement.innerText === 'User' ) ? 'Premium' : 'User';
    userStatusElement.innerText = newStatus;


    fetch(`/api/users/premium/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus }),
    })
    .then(result =>{
      if(result.status === 200){
          window.location.replace('/products');
      }
  })
    .catch(error => console.error('Error:', error));
}