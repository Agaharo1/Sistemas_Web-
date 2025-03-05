import express from 'express';
import {Producto} from '../productos/Productos.js'

const contenidoRouter = express.Router();



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
    let productos = []
    productos = Producto.getProducts();
    if (req.session.login) {
        contenido = 'paginas/contenido/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        productos
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
