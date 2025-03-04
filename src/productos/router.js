import express from 'express';
import { viewSubirProducto, doSubirProducto } from './controllers.js';
const productossRouter = express.Router();

productossRouter.get('/subir',viewSubirProducto);
productossRouter.post('/subir',doSubirProducto);

export default productossRouter;