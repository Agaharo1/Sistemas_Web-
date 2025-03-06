import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { viewSubirProducto, doSubirProducto, viewProductoExitoso,eliminarProducto,editarProducto,doEditarProducto} from './controllers.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productossRouter = express.Router();

const multerFactory = multer({ dest: config.uploads });

productossRouter.get('/subir',viewSubirProducto);

productossRouter.post('/subir',multerFactory.single('imagen'),doSubirProducto);

productossRouter.get('/productoExitoso',viewProductoExitoso);

productossRouter.get('/eliminarProducto/:id',eliminarProducto);

productossRouter.get('/editarProducto/:id',editarProducto);

productossRouter.post('/editar',doEditarProducto);


export default productossRouter;