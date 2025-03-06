import express from 'express';
import {Producto} from '../productos/Productos.js'
import {Imagen} from '../imagenes/Imagen.js'

const contenidoRouter = express.Router();

contenidoRouter.get('/misProductos', (req, res) => {
    let contenido = 'paginas/contenido/noPermisos';
    let productos = [];
    let productosImagenes = {}; // Diccionario para asociar productos con imágenes

    if (req.session.login) {
        productos = Producto.getProductByUserId(req.session.user_id);

        // Crear el diccionario de productos e imágenes
        productos.forEach(producto => {
            const imagenes = Imagen.getImagenByProductId(producto.id);
            productosImagenes[producto.id] = imagenes;
        });

        contenido = 'paginas/contenido/misProductos';
    }

    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        productosImagenes // Pasar el diccionario a la vista
    });
});

contenidoRouter.get('/flogin', (req, res) => {

    const params = {
        contenido: 'paginas/contenido/flogin',
        session: req.session
    }
    res.render('pagina', params);
})

contenidoRouter.get('/vlogin', (req, res) => {

    const params = {
        contenido: 'paginas/contenido/vlogin',
        session: req.session
    }
    res.render('pagina', params);
})

contenidoRouter.get('/normal', (req, res) => {
    let contenido = 'paginas/contenido/noPermisos';
    let productos = [];
    let productosImagenes = {}; // Diccionario para asociar productos con imágenes

    productos = Producto.getProducts();

    // Crear el diccionario de productos e imágenes
    productos.forEach(producto => {
        const imagenes = Imagen.getImagenByProductId(producto.id);
        productosImagenes[producto.id] = imagenes;
    });

    if (req.session.login) {
        contenido = 'paginas/contenido/normal';
    }

    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        productosImagenes // Pasar el diccionario a la vista
    });
});

contenidoRouter.get('/admin', (req, res) => {
    // Parámetros que estarán disponibles en la plantilla
    if (req.session.esAdmin){
        const params = {
            contenido: 'paginas/contenido/admin', // fichero ejs que tiene el contenido específico para esta vista
            session: req.session // Necnesario para (entre otras cosas) utilizarlo en mostrarSaludo de cabecera.ejs
        }
        res.render('pagina', params);
    }
    else{
        const params = {
            contenido: 'paginas/contenido/noAdmin', // fichero ejs que tiene el contenido específico para esta vista
            session: req.session // Necnesario para (entre otras cosas) utilizarlo en mostrarSaludo de cabecera.ejs
        }
        res.render('pagina', params);
    }
});

export default contenidoRouter;
