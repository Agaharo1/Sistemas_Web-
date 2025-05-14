import { validationResult, matchedData } from 'express-validator';
import { Producto } from '../Productos.js';
import { pick } from 'lodash-es';
import { logger } from '../../logger.js';

export async function getTotalProductos(req, res) {
    try {
        const total = await Producto.getNumberOfProducts();
        res.status(200).json(total);
    } catch (error) {
        logger.error('Error al obtener el total de productos:', error);
        res.status(500).json({ error: 'Error al obtener el total de productos' });
    }
}

export async function getTotalProductosUser(req, res) {
    try {
        const total = await Producto.getNumberOfProductsUser(req.session.user_id);
        res.status(200).json(total);
    } catch (error) {
        logger.error('Error al obtener el total de productos:', error);
        res.status(500).json({ error: 'Error al obtener el total de productos' });
    }
}

export async function getPaginaProductos(req, res) {
    try {
        const result = validationResult(req);
        const datos = matchedData(req, { includeOptionals: true });
        if (! result.isEmpty()) {
            const errores = result.array();
            return res.status(400).json({ status: 400, errores });
        }
        const productos = await Producto.getPaginaProductos(datos.pagina);
        res.status(200).json(productos);
    } catch (error) {
        logger.error('Error al obtener la página de productos:', error);
        res.status(500).json({ error: 'Error al obtener la página de productos' });
    }
}

export async function getPaginaProductosUser(req, res) {
    try {
        const result = validationResult(req);
        const datos = matchedData(req, { includeOptionals: true });
        if (! result.isEmpty()) {
            const errores = result.array();
            return res.status(400).json({ status: 400, errores });
        }
        const productos = await Producto.getPaginaProductosUser(datos.pagina, req.session.user_id);
        res.status(200).json(productos);
    } catch (error) {
        logger.error('Error al obtener la página de productos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener la página de productos del usuario' });
    }
}