import { matchedData } from 'express-validator';
import { Chat } from '../chat/Chat.js';
import { Producto } from '../productos/Productos.js';


export function autenticado(urlNoAutenticado = '/usuarios/login', urlAutenticado) {
    
    return (req, res, next) => {
        if (req.session != null && req.session.login) {
            if (urlAutenticado != undefined) return res.redirect(urlAutenticado);
            return next();
        }
        if (urlNoAutenticado != undefined) {
            return res.redirect(urlNoAutenticado);
        }
        next();
    }
}

export function tieneRol(rol = RolesEnum.ADMIN){
    return (req, res, next) => {
        if (req.session != null && req.session.rol === rol) return next();
        res.render('pagina', {
            contenido: 'paginas/noPermisos',
            session: req.session
        });
    }
}

/**
 * Middleware para verificar si un usuario pertenece a un chat.
 * @param {string} redirectUrl - URL a la que redirigir si el usuario no pertenece al chat (opcional).
 */
export function perteneceAlChat(redirectUrl ="/usuarios/index") {
    return async (req, res, next) => {
        try {
            const datos = matchedData(req, { includeOptionals: true });
            const chatId = datos.id || datos.id_chat;
            const userId = req.session.user_id;

            const userBelongsToChat = await Chat.userPerteneceChat(chatId, userId);

            if (!userBelongsToChat) {
                if (redirectUrl) {
                    return res.redirect(redirectUrl);
                }
                return res.status(403).json({ error: 'No tienes permiso para acceder a este chat.' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    };
}

export function chatExistente(){
    return async (req, res, next) => {
        try {
            const datos = matchedData(req, { includeOptionals: true });
            const id_user_producto = parseInt(datos.id_user_producto);
            const id_user_sesion = parseInt(datos.id_user_sesion);
            const id = parseInt(datos.id);
            
            //Comprobamos si ya existe un chat entre los dos usuarios
            const chatExistente = await Chat.getChatByUsers(id_user_producto,id_user_sesion, id);
            if (chatExistente !== null) {
            //Si existe, redirigimos al chat existente
                return res.redirect(`/chats/chat/${chatExistente.id}`);
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    };
}

export  function esMiProducto(){
    return async (req, res, next) =>{
        const datos = matchedData(req, { includeOptionals: true });
        const producto = await Producto.getProductById(datos.id);
        if (req.session.user_id != producto.id_user) {
            res.status(400).send("No puedes editar un producto que no es tuyo");
        } else {
            next();
        }
    };
}