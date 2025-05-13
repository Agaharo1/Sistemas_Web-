import express from 'express';
import { param } from 'express-validator';
import { autenticado, tieneRol } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';
import { listNotificaciones } from './controllers.js';

const notificacionesRouter = express.Router();

notificacionesRouter.use(autenticado('/usuarios/login'));

notificacionesRouter.get('/chat/:id_chat'        //Encargado de gestionar las notificaciones de chats
    , param('id_chat', 'Falta id de chat')
    , asyncHandler(listNotificaciones));

export default notificacionesRouter;