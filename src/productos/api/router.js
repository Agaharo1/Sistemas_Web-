import express from 'express';
import { query, body } from 'express-validator';
import { getPaginaProductos, getTotalUsuarios } from './controllers.js';
import asyncHandler from 'express-async-handler';



const productosApiRouter = express.Router();

productosApiRouter.get('/'
    , query('pagina').optional().isInt()
    , asyncHandler(getPaginaProductos));

productosApiRouter.get('/total'
    , asyncHandler(getTotalUsuarios));
    
export default productosApiRouter;