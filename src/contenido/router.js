import express from 'express';
import {Producto} from '../productos/Productos.js'
import {Imagen} from '../imagenes/Imagen.js'
import { renderMiContenido, renderNormal } from './controllers.js';
import { autenticado,perteneceAlChat,chatExistente } from '../middleware/auth.js';
import { body,param,query } from 'express-validator';
import asyncHandler from 'express-async-handler';

const contenidoRouter = express.Router();

contenidoRouter.get('/misProductos', 
    query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero mayor o igual a 1'),
    autenticado("/usuarios/login"),
    asyncHandler(renderMiContenido));



contenidoRouter.get('/normal',query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero mayor o igual a 1'),
    asyncHandler(renderNormal));


export default contenidoRouter;
