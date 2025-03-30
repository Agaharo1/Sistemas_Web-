import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { mostrarProducto,viewSubirProducto, doSubirProducto, viewProductoExitoso,eliminarProducto,editarProducto,doEditarProducto,envioProducto,pagoProducto} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 

const productossRouter = express.Router();

const multerFactory = multer({ dest: config.uploads });

productossRouter.get('/subir',viewSubirProducto);

productossRouter.post('/subir',multerFactory.single('imagen'),doSubirProducto);

productossRouter.get('/productoExitoso',viewProductoExitoso);

productossRouter.get('/eliminarProducto/:id',eliminarProducto);

productossRouter.get('/editarProducto/:id',editarProducto);

productossRouter.post('/editar',doEditarProducto);

productossRouter.get('/producto/:id',mostrarProducto);

productossRouter.get('/envioProducto/:id', autenticado('/usuarios/login'), envioProducto); //lo de autenticado es el middleware que verifica si el usuario está autenticado, si no lo está lo redirige a la página de login. Si el usuario está autenticado, se ejecuta envioProducto.

productossRouter.get('/pagoProducto/:id', autenticado('/usuarios/login'), pagoProducto);
export default productossRouter;