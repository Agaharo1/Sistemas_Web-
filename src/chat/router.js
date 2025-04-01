import express from 'express';
import { viewChat,viewMisChats,enviarMensaje,nuevoChat } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const chatRouter = express.Router();

chatRouter.get('/chat/:id',  viewChat);
chatRouter.get('/misChats/:id',  viewMisChats);
chatRouter.post('/enviarMensaje', body('mensaje', 'No puede ser vacío').trim().notEmpty(), enviarMensaje);
chatRouter.get('/nuevoChat/:id',  nuevoChat);
export default chatRouter;