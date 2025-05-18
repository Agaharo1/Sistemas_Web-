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
    const formRegistro = document.forms.namedItem('editarPerfil');
    formRegistro.addEventListener('submit', registroSubmit);

    const username = formRegistro.elements.namedItem('username');

    // username.addEventListener('change', usernameDisponible);
    username.addEventListener('input', usernameDisponible);
}

/**
 * 
 * @param {SubmitEvent} e 
 */
async function registroSubmit(e){
    // No se envía el formulario manualmente
    e.preventDefault();
    const formRegistro = e.target;
    try {
        const formData = new FormData(formRegistro);
        const response = await postData('/usuarios//editarPerfil', formData);
        window.location.assign('/usuarios/index');
    } catch (err) {
        if (err instanceof ResponseError) {
            switch(err.response.status) {
                case 400:
                    await displayErrores(err.response);
                    break;
            }
        }
        console.error(`Error: `, err);
    } 
}

async function displayErrores(response) {
    const { errores } = await response.json();
    const formRegistro = document.forms.namedItem('registro');
    for(const input of formRegistro.elements) {
        if (input.name == undefined || input.name === '') continue;
        const feedback = formRegistro.querySelector(`*[name="${input.name}"] ~ span.error`);
        if (feedback == undefined) continue;

        feedback.textContent = '';

        const error = errores[input.name];
        if (error) {
            feedback.textContent = error.msg;
        }
    }
}

async function usernameDisponible(e) {
    const username = e.target;
    try {
        username.setCustomValidity('');
        const feedback = username.form.querySelector(`*[name="${username.name}"] ~ .feedback`);
        feedback.textContent = '';
        if (username.value === '') return;

        const response = await postJson('/api/usuarios/disponibleEditar', {
            username: username.value
        });

        const jsonData = await response.json();
        const estaDisponible = JSON.parse(jsonData);
        if (!estaDisponible) {
            username.setCustomValidity('Correo ya registrado.');
            feedback.textContent = '⚠';
        } else {
            username.setCustomValidity('');
            feedback.textContent = '✔';
        }
        
    } catch (err) {
        console.error(`Error: `, err);
    }
}