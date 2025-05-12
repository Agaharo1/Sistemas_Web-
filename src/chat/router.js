import express from 'express';
import { viewChat,viewMisChats,enviarMensaje,nuevoChat,eliminarChat,enviarMensajeJS } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
import { Chat } from './Chat.js';
import { logger } from '../logger.js';
const chatRouter = express.Router();

chatRouter.get('/chat/:id', autenticado('/usuarios/login'),
async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const userId = req.session.user_id; // Assuming `req.user` contains the authenticated user's info

        
        const userBelongsToChat = await Chat.userPerteneceChat(chatId, userId);

        if (!userBelongsToChat) {
            return res.status(403).json({ error: 'No tienes permiso para acceder a este chat.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
},
viewChat);
chatRouter.get('/misChats',autenticado('/usuarios/login'),  viewMisChats);
chatRouter.post('/enviarMensaje', body('mensaje', 'No puede ser vacío').trim().notEmpty(), enviarMensaje);
chatRouter.post('/enviarMensajeJS', enviarMensajeJS);
chatRouter.get('/nuevoChat/:id',autenticado("/usuarios/login") , nuevoChat);
chatRouter.post('/eliminarChat/:id',  eliminarChat);
export default chatRouter;