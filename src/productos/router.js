import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { mostrarProducto,viewSubirProducto, doSubirProducto, viewProductoExitoso,eliminarProducto,editarProducto,doEditarProducto,pagoProducto,buscarProducto} from './controllers.js';
import { autenticado,esMiProducto } from '../middleware/auth.js'; 
import { body,param,query } from 'express-validator';
import asyncHandler from 'express-async-handler';

const productossRouter = express.Router();

const multerFactory = multer({ dest: config.uploads });

productossRouter.get('/subir',autenticado(),viewSubirProducto);

productossRouter.post('/subir',multerFactory.single('imagen'),doSubirProducto);

productossRouter.get('/productoExitoso',viewProductoExitoso);

productossRouter.post('/eliminarProducto/:id',param('id'),esMiProducto(),asyncHandler(eliminarProducto));

productossRouter.get('/editarProducto/:id',param('id'),autenticado(),asyncHandler(esMiProducto()),asyncHandler(editarProducto)); 

productossRouter.post(
    '/editar',
    body('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('nombre').isString().isLength({ min: 1, max: 100 }).withMessage('Nombre requerido y máximo 100 caracteres'),
    body('descripcion').isString().isLength({ min: 1, max: 500 }).withMessage('Descripción requerida y máximo 500 caracteres'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
    asyncHandler(esMiProducto()),
    doEditarProducto
);

productossRouter.get('/producto/:id',param('id'),asyncHandler(mostrarProducto));

productossRouter.get('/resumenProducto/:id', autenticado('/usuarios/login'), asyncHandler(pagoProducto));

productossRouter.get(
    '/buscar',
    query('query')
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('La búsqueda es requerida y máximo 100 caracteres'),
    buscarProducto
);


export default productossRouter;