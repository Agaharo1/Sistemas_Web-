import {Chat} from "../chat/Chat.js";
import { Imagen } from "../imagenes/Imagen.js";
import { matchedData,validationResult,body } from 'express-validator';
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";
import {  broadcastMessage } from '../sse/utils.js';

export function renderMiContenido(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
    const datos = matchedData(req, { includeOptionals: true });
    if(datos.pagina){
        const pagina = parseInt(datos.pagina);
        if (pagina < 1) {
            return res.status(400).json({ status: 400, error: 'La página debe ser un número entero mayor o igual a 1' });
        }
    }else{
        datos.pagina = 1;
    }

    let productos = [];
    productos = Producto.getProductByUserId(parseInt(req.session.user_id));
    contenido = 'paginas/contenido/misProductos';
    

    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        totalPaginas
    });
};

export function renderNormal(req, res) {
     const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
    const datos = matchedData(req, { includeOptionals: true });
    if(datos.pagina){
        const pagina = parseInt(datos.pagina);
        if (pagina < 1) {
            return res.status(400).json({ status: 400, error: 'La página debe ser un número entero mayor o igual a 1' });
        }
    }else{
        datos.pagina = 1;
    }
    const totalProductos = Producto.getNumberOfProducts();
    const totalPaginas = Math.ceil(totalProductos / 3);
    const contenido = 'paginas/contenido/normal';
    const pagina = parseInt(datos.pagina);
    let productos = [];
    productos = Producto.getPaginaProductos(pagina);
    
    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        totalPaginas
    });
}