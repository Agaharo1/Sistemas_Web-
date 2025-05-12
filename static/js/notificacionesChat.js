
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
    const messageForm = document.querySelector('form.message-form');

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
                console.log('Formulario enviado con éxito');
            } else {
                console.error('Error al enviar el formulario:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });


}
