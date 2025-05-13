/*
 * Inicializamos el JS cuando se ha terminado de procesar todo el HTML de la página.
 *
 * Al incluir <script> al final de la página podríamos invocar simplemente a init().
 */
document.addEventListener('DOMContentLoaded', init);

/**
 * Inicializa la página
 */
async function init() {
    const productosContainer = document.getElementById('productos-container');
    try {
        const response = await safeFetch('/api/productos/total');
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        const totalProductos = await response.json();
        const productosPorPagina = 4;
        const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

        let paginaActual = 1;
        renderPagina(paginaActual,totalPaginas);
    } catch (err) {
        console.error('Error al cargar los productos:', err);
    }
}

/**
 * 
 * @param {SubmitEvent} e 
 */

 async function renderPagina(pagina,totalPaginas) {
            while (productosContainer.firstChild) {
            productosContainer.removeChild(productosContainer.firstChild);
            }
            const response = await safeFetch(`/api/productos?pagina=${pagina}`);
            if (!response.ok) {
                throw new Error(`Error al obtener productos de la página: ${response.statusText}`);
            }
            const productosPagina = await response.json();

            productosPagina.forEach(producto => {
                const productoElement = document.createElement('div');
                productoElement.className = 'producto';
                productoElement.textContent = `${producto.nombre} - $${producto.precio}`;
                productosContainer.appendChild(productoElement);
            });

            renderBotones(totalPaginas);
}

function renderBotones(totalPaginas) {
    const botonesContainer = document.getElementById('paginas-container');
    while (botonesContainer.firstChild) {
    botonesContainer.removeChild(botonesContainer.firstChild);
    }

    for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement('button');
    boton.textContent = i;
    boton.className = 'boton-pagina';
    if (i === paginaActual) {
        boton.disabled = true;
    }
    boton.addEventListener('click', () => {
        paginaActual = i;
        renderPagina(paginaActual);
    });
    botonesContainer.appendChild(boton);
    }
}
