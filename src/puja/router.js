import express from 'express';
import { viewPuja,viewMisPujas,pujar,nuevaPuja,eliminarPuja } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const pujaRouter = express.Router();

pujaRouter.get('/puja/:id', autenticado, viewPuja);
pujaRouter.get('/misPujas', autenticado, viewMisPujas);
pujaRouter.post('/pujar', autenticado, body('pujada', 'No puede ser vacío').isFloat({ min: 0.01 }).notEmpty().withMessage('No puede ser vacío').trim(),pujar);
pujaRouter.get('/nuevaPuja/:id', nuevaPuja);
pujaRouter.get('/eliminarPuja/:id',  autenticado, eliminarPuja);
export default pujaRouter;