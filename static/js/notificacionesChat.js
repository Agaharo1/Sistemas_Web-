
/*
 * Inicializamos el JS cuando se ha terminado de procesar todo el HTML de la página.
 *
 * Al incluir <script> al final de la página podríamos invocar simplemente a init().
 */

document.addEventListener('DOMContentLoaded', init);

/**
 * Inicializa la página
 */
function init() {
   /*
    const chatIdInput = document.querySelector('form.message-form input[name="id_chat"]');
    const chatId = chatIdInput ? chatIdInput.value : null;
    const notificaciones = new EventSource("/notificaciones/chat/" + chatId);

    notificaciones.addEventListener('open', e => {
        console.log('SSE connection established.');
    });

    notificaciones.addEventListener('error', e => {
        if (e.eventPhase === EventSource.CLOSED) {
            console.log('SSE connection closed');
        }
        else {
            console.log('error', e);
        }
    });

    notificaciones.addEventListener('message', e => {
        console.log('RECEIVED', e.data);
        listaNotificaciones.appendChild(createElement('li', {}, e.data));
    });
    */
    const messageForm = document.querySelector('form.message-form'); // Selecciona el formulario de mensajes
    const messagesContainer = document.querySelector('.messages'); // Selecciona el contenedor de mensajes

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(messageForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        
        
        try {
            const response = await postJson('/chats/enviarMensajeJS', jsonData); 
            if (response.ok) {
                //Si el mensaje se envía correctamente, pintamos el mensaje en la pantalla
                console.log('Formulario enviado con éxito');

                // Añade el nuevo mensaje al contenedor de mensajes
                const newMessage = document.createElement('div');
                newMessage.classList.add('message', 'sent'); // Añade las clases CSS necesarias
                newMessage.innerHTML = `<p>${jsonData.mensaje}</p>`;
                messagesContainer.appendChild(newMessage);

                // Limpia el campo de texto del formulario
                messageForm.querySelector('textarea[name="mensaje"]').value = '';

                // Desplaza el contenedor de mensajes hacia abajo
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                console.error('Error al enviar el formulario:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });


}
