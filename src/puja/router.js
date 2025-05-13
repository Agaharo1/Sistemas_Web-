import express from 'express';
import {
  viewPuja,
  viewMisPujas,
  pujar,
  nuevaPuja,
  eliminarPuja
} from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';

const pujaRouter = express.Router();

// Ver una puja específica
pujaRouter.get('/puja/:id', viewPuja);

// Ver todas las pujas del usuario actual (usa sesión, no necesita :id_u)
pujaRouter.get('/misPujas', viewMisPujas);

// Crear una nueva puja para un producto
pujaRouter.post('/nuevaPuja/:id_producto', nuevaPuja);

// Realizar una pujada (puja sobre una puja existente)
pujaRouter.post(
  '/pujar/:id_puja',
  body('pujada')
    .isFloat({ min: 0.01 })
    .withMessage('La puja debe ser un número mayor que 0.01')
    .trim(),
  pujar
);

// Eliminar una puja
pujaRouter.get('/eliminarPuja/:id', eliminarPuja);

export default pujaRouter;
