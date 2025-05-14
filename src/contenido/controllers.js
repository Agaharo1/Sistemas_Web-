import {Chat} from "../chat/Chat.js";
import { Imagen } from "../imagenes/Imagen.js";
import { matchedData,validationResult,body } from 'express-validator';
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";
import {  broadcastMessage } from '../sse/utils.js';

export async function renderMiContenido(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
    const datos = matchedData(req, { includeOptionals: true });
    let pagina = 1;
    if(datos.pagina){
        pagina = parseInt(datos.pagina);
        if (pagina < 1) {
            return res.status(400).json({ status: 400, error: 'La página debe ser un número entero mayor o igual a 1' });
        }
    }

    const user_id = req.session.user_id;
    const contenido = 'paginas/contenido/misProductos';
    const totalProductos = await Producto.getNumberOfProductsUser(user_id);
    const totalPaginas = Math.ceil(totalProductos / 3);
    let productos = [];
    productos = await Producto.getPaginaProductosUser(pagina, user_id);
    

    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        totalPaginas,
        esPerfil: true
    });
};

export async function renderNormal(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
    const datos = matchedData(req, { includeOptionals: true });
    let pagina = 1;
    if(datos.pagina){
        pagina = parseInt(datos.pagina);
        if (pagina < 1) {
            return res.status(400).json({ status: 400, error: 'La página debe ser un número entero mayor o igual a 1' });
        }
    }
    const totalProductos =await Producto.getNumberOfProducts();
    const totalPaginas = Math.ceil(totalProductos / 3);
    const contenido = 'paginas/contenido/normal';
    let productos = [];
    productos = await Producto.getPaginaProductos(pagina);
    
    res.render('pagina', {
        contenido,
        session: req.session,
        productos,
        totalPaginas
    });
}