import express from 'express';
import { viewSubirProducto, doSubirProducto, viewProductoExitoso} from './controllers.js';
const productossRouter = express.Router();

productossRouter.get('/subir',viewSubirProducto);
productossRouter.post('/subir',doSubirProducto);

productossRouter.get('/productoExitoso',viewProductoExitoso);


export default productossRouter;