import express from 'express';
import { viewMisPujas, enviarPuja, verPujas, verPuja, iniciarOcrearPuja, nuevaPuja} from './controllers.js';
import { body } from 'express-validator';

const pujaRouter = express.Router();

// Rutas para ver las pujas, enviar una puja
pujaRouter.get('/pujas', verPujas);
pujaRouter.get('/puja/:id', verPuja);
pujaRouter.get('/crearPuja', nuevaPuja);
pujaRouter.get('/misPujas', viewMisPujas);  // Ver todas las pujas del usuario
pujaRouter.post('/enviarPuja', body('valor', 'La cantidad de la puja no puede estar vacía').notEmpty().isFloat({ gt: 0 }), enviarPuja); // Enviar una nueva puja

export default pujaRouter;  