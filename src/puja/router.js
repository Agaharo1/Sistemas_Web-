import express from 'express';
import { viewPuja,viewMisPujas,pujar,nuevaPuja,eliminarPuja } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const pujaRouter = express.Router();

pujaRouter.get('/puja/:id', viewPuja);
pujaRouter.get('/misPujas/:id_u', viewMisPujas);
pujaRouter.post('/pujar/:id_puja', body('pujada', 'No puede ser vacío').isFloat({ min: 0.01 }).notEmpty().withMessage('No puede ser vacío').trim(),pujar);
pujaRouter.get('/nuevaPuja/:id_producto', nuevaPuja);
pujaRouter.get('/eliminarPuja/:id', eliminarPuja);
export default pujaRouter;