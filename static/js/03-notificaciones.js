
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
    const listaNotificaciones = document.querySelector('ul.notificaciones');

    const notificaciones = new EventSource("/notificaciones/global");

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
}
