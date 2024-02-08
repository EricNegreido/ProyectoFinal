document.getElementById('forgetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const resetEmail = document.getElementsByName('resetEmail')[0].value;
    console.log(resetEmail)
    try {
        const response = await fetch('/api/sessions/forget-password', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetEmail }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('resetMessage').innerHTML = '<p class="success">Correo electrónico de restablecimiento enviado con éxito.</p>';
        } else {
            document.getElementById('resetMessage').innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resetMessage').innerHTML = '<p class="error">Error al enviar la solicitud de restablecimiento de contraseña.</p>';
    }
});