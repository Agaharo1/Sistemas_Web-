import express from 'express';
import { viewChat,viewMisChats,enviarMensaje,nuevoChat,eliminarChat,enviarMensajeJS } from './controllers.js';
import { autenticado,perteneceAlChat,chatExistente } from '../middleware/auth.js';
import { body,param,query } from 'express-validator';
import asyncHandler from 'express-async-handler';
const chatRouter = express.Router();

chatRouter.get('/chat/:id', autenticado('/usuarios/login'),param('id').isInt(),
perteneceAlChat(),
asyncHandler(viewChat));
chatRouter.get('/misChats',autenticado('/usuarios/login'),  viewMisChats);
chatRouter.post('/enviarMensaje', body('mensaje', 'No puede ser vacío').trim().notEmpty(),body('id_chat').isInt(),perteneceAlChat(), enviarMensaje);
chatRouter.post('/enviarMensajeJS',body('mensaje', 'No puede ser vacío').trim().notEmpty(),body('id_chat').isInt(),perteneceAlChat(), enviarMensajeJS);
chatRouter.post('/nuevoChat/:id',autenticado("/usuarios/login"), param('id').isInt().withMessage('El ID del producto debe ser un número entero'),
        query('id_user_producto').isInt().withMessage('El ID del usuario del producto debe ser un número entero'),
        query('id_user_sesion').isInt().withMessage('El ID del usuario en sesión debe ser un número entero'),
        chatExistente(),
       asyncHandler(nuevoChat));
chatRouter.post('/eliminarChat/:id',perteneceAlChat(), asyncHandler(eliminarChat));
export default chatRouter;