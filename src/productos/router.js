import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { mostrarProducto,viewSubirProducto, doSubirProducto, viewProductoExitoso,eliminarProducto,editarProducto,doEditarProducto,pagoProducto,buscarProducto} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 

const productossRouter = express.Router();

const multerFactory = multer({ dest: config.uploads });

productossRouter.get('/subir',viewSubirProducto);

productossRouter.post('/subir',multerFactory.single('imagen'),doSubirProducto);

productossRouter.get('/productoExitoso',viewProductoExitoso);

productossRouter.post('/eliminarProducto/:id',eliminarProducto);

productossRouter.get('/editarProducto/:id',editarProducto);

productossRouter.post('/editar',doEditarProducto);

productossRouter.get('/producto/:id',mostrarProducto);

productossRouter.get('/resumenProducto/:id', autenticado('/usuarios/login'), pagoProducto);

productossRouter.get('/buscar', buscarProducto);


export default productossRouter;