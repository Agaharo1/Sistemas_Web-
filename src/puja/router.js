import express from 'express';
import { viewPuja,viewMisPujas,pujar,nuevaPuja,eliminarPuja } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const pujaRouter = express.Router();

pujaRouter.get('/puja/:id',  viewPuja);
pujaRouter.get('/misPujas',  viewMisPujas);
pujaRouter.post('/pujar', body('pujada', 'No puede ser vacío').trim().notEmpty(), pujar);
pujaRouter.get('/nuevaPuja/:id',  nuevaPuja);
pujaRouter.get('/eliminarPuja/:id',  eliminarPuja);
export default pujaRouter;