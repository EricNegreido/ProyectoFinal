document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const token = document.getElementsByName('token')[0].value;
    const newPassword = document.getElementById('newPassword').value;
  
    const data = {
      token: token,
      newPassword: newPassword,
    };
  
    await fetch('/api/sessions/reset-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(respuesta => {
        console.log('respond:', respuesta)
        console.log('Request Headers:', respuesta.headers);
        if(respuesta.status === 200){
            window.location.replace('/login');
        }else{
            window.location.replace('/login');
        }
    })
      .catch(error => console.error('Error:', error));
  });
  
