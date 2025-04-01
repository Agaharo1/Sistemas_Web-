import express from 'express';
import { viewChat,viewMisChats,enviarMensaje } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const chatRouter = express.Router();

chatRouter.get('/chat/:id',  autenticado(null, '/usuarios/home'),viewChat);
chatRouter.get('/misChats/:id', autenticado(null, '/usuarios/home'), viewMisChats);
chatRouter.post('/enviarMensaje', autenticado(null, '/usuarios/home'), body('mensaje', 'No puede ser vacío').trim().notEmpty(), enviarMensaje);
export default chatRouter;