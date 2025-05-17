
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
    const messageForm = document.querySelector('form.message-form'); // Selecciona el formulario de mensajes
    const messagesContainer = document.querySelector('.messages'); // Selecciona el contenedor de mensajes
    const chatId = messageForm.querySelector('input[name="id_chat"]').value; // Obtiene el ID del chat desde el formulario
    // Establece la conexión SSE
    const notificaciones = new EventSource(`/notificaciones/chat/${chatId}`);

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
        try {
            // Aquí se recibe el mensaje del servidor
            //Pintamos el mensaje en la pantalla
            const message = JSON.parse(e.data);
            // Añade el nuevo mensaje al contenedor de mensajes
            const newMessage = document.createElement('div');
            newMessage.classList.add('message', parseInt(message.senderId) === parseInt(sessionUserId) ? 'sent' : 'received');
            newMessage.innerHTML = `<p>${message.contenido}</p>`;
            messagesContainer.appendChild(newMessage);
            // Desplaza el contenedor de mensajes hacia abajo
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            console.log('Mensaje recibido:', message);
        }catch(e){
            console.error('Mensaje no esta en formato:', e);
        }
    });
    
    
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(messageForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        
        
        try {
            const response = await postJson('/chats/enviarMensajeJS', jsonData); 
            messageForm.querySelector('textarea[name="mensaje"]').value = '';
            if (response.ok) {
                
                console.log('Formulario enviado con éxito');
               
            } else {
                console.error('Error al enviar el formulario:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });


}
