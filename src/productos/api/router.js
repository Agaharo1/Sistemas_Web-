import express from 'express';
import { query, body } from 'express-validator';
import { getPaginaProductos, getTotalProductos,getTotalProductosUser,getPaginaProductosUser } from './controllers.js';
import asyncHandler from 'express-async-handler';



const productosApiRouter = express.Router();

productosApiRouter.get('/'
    , query('pagina').optional().isInt()
    , asyncHandler(getPaginaProductos));

productosApiRouter.get('/paginaUsuario'
    , query('pagina').optional().isInt()
    , asyncHandler(getPaginaProductosUser));

productosApiRouter.get('/totalUsuario'
    , asyncHandler(getTotalProductosUser));

productosApiRouter.get('/total'
    , asyncHandler(getTotalProductos));
    
export default productosApiRouter;