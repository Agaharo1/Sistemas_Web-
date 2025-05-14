
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
        const response = await safeFetch('/api/productos/totalUsuario');
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        const totalProductos = await response.json();
        const productosPorPagina = 3;
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

 async function renderPagina(paginaActual,totalPaginas) {
    const productosContainer = document.getElementById('productos-container');

    while (productosContainer.firstChild) {
        productosContainer.removeChild(productosContainer.firstChild);
    }
    const response = await safeFetch(`/api/productos/paginaUsuario?pagina=${paginaActual}`);
    if (!response.ok) {
        throw new Error(`Error al obtener productos de la página: ${response.statusText}`);
    }
    const productosPagina = await response.json();
    addProductos(productosPagina);

    renderBotones(totalPaginas,paginaActual);
}

function addProductos(productosPagina) {
    const productosContainer = document.getElementById('productos-container');
    

    if (productosPagina.length > 0) {
        productosPagina.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.className = 'producto';

            // Imagen o mensaje si no hay imagen
            if (producto.imagen) {
                const link = document.createElement('a');
                link.href = `/productos/producto/${producto.id}`;
                const img = document.createElement('img');
                img.src = `/imagenes/imagen/${producto.id}/${producto.imagen}`;
                img.alt = producto.nombre;
                img.className = 'product-image';
                link.appendChild(img);
                productoElement.appendChild(link);
            } else {
                const noImageText = document.createElement('p');
                noImageText.textContent = 'No hay imágenes disponibles para este producto.';
                productoElement.appendChild(noImageText);
            }

            // Nombre y precio
            const productInfo = document.createElement('p');
            productInfo.textContent = `Producto: ${producto.nombre} - Precio: ${producto.precio}`;
            productoElement.appendChild(productInfo);

            // Descripción
            const productDescription = document.createElement('p');
            productDescription.textContent = 'Descripción: ' + (producto.descripcion ? producto.descripcion : 'Este producto no tiene descripción.');
            productoElement.appendChild(productDescription);

            // Vendido o editar/eliminar
            if (producto.vendido) {
                const formEliminar = document.createElement('form');
                formEliminar.action = `/productos/eliminarProducto/${producto.id}`;
                formEliminar.method = 'POST';
                formEliminar.className = 'formEliminar';
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'submit';
                btnEliminar.textContent = 'Eliminar';
                formEliminar.appendChild(btnEliminar);
                productoElement.appendChild(formEliminar);

                const soldDiv = document.createElement('div');
                soldDiv.className = 'sold-product';
                const soldText = document.createElement('p');
                soldText.innerHTML = '<strong>Producto vendido</strong>';
                soldDiv.appendChild(soldText);
                productoElement.appendChild(soldDiv);
            } else {
                const divAcciones = document.createElement('div');

                const linkEditar = document.createElement('a');
                linkEditar.href = `/productos/editarProducto/${producto.id}`;
                linkEditar.className = 'button-link';
                linkEditar.textContent = 'Editar';
                divAcciones.appendChild(linkEditar);

                const formEliminar = document.createElement('form');
                formEliminar.action = `/productos/eliminarProducto/${producto.id}`;
                formEliminar.method = 'POST';
                formEliminar.className = 'formEliminar';
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'submit';
                btnEliminar.textContent = 'Eliminar';
                formEliminar.appendChild(btnEliminar);
                divAcciones.appendChild(formEliminar);

                productoElement.appendChild(divAcciones);
            }

            productosContainer.appendChild(productoElement);
        });
    } else {
        const noProductsText = document.createElement('p');
        noProductsText.textContent = 'No hay productos disponibles.';
        productosContainer.appendChild(noProductsText);
    }
}

function renderBotones(totalPaginas,paginaActual) {
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
        renderPagina(paginaActual,totalPaginas);
    });
    botonesContainer.appendChild(boton);
    }
}
