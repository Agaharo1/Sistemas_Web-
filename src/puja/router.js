import express from 'express';
import {
  viewPuja,
  viewMisPujas,
  pujar,
  nuevaPuja,
  eliminarPuja,
  viewMisSubastas,
  eliminarPujaPropietario
} from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

const pujaRouter = express.Router();

// Ver una puja específica
pujaRouter.get('/puja/:id',autenticado('/usuarios/login'), asyncHandler(viewPuja));

// Ver todas las pujas del usuario actual (usa sesión, no necesita :id_u)
pujaRouter.get('/misPujas', asyncHandler(viewMisPujas));

pujaRouter.get('/misSubastas', asyncHandler(viewMisSubastas));

pujaRouter.post('/eliminarPujaPropietario/:id', asyncHandler(eliminarPujaPropietario));

// Crear una nueva puja para un producto
pujaRouter.post('/nuevaPuja/:id_producto',autenticado('/usuarios/login'), asyncHandler(nuevaPuja));

// Realizar una pujada (puja sobre una puja existente)
pujaRouter.post(
  '/pujar/:id_puja',autenticado('/usuarios/login'),
  body('valor', 'Debes introducir un número válido').isFloat({ min: 0.01 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      return res.redirect(`/pujas/puja/${req.params.id_puja}?error=${encodeURIComponent(errorMsg)}`);
    }
    next();
  },
  pujar
);

// Eliminar una puja
pujaRouter.get('/eliminarPuja/:id', eliminarPuja);

export default pujaRouter;
