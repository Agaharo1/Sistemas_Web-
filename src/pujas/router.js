import express from 'express';
import { viewMisPujas, enviarPuja, verPujas, verPuja} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; // Asegúrate de tener esta autenticación
import { body } from 'express-validator';

const pujaRouter = express.Router();

// Rutas para ver las pujas, enviar una puja
pujaRouter.get('/pujas', verPujas);
pujaRouter.get('/', verPujas);
pujaRouter.get('/misPujas', viewMisPujas);  // Ver todas las pujas del usuario
pujaRouter.post('/enviarPuja', body('valor', 'La cantidad de la puja no puede estar vacía').notEmpty().isFloat({ gt: 0 }), enviarPuja); // Enviar una nueva puja

export default pujaRouter;