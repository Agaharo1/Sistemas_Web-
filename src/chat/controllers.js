
import { config } from "../config.js";
import {Chat} from "../chat/Chat.js";
import { Imagen } from "../imagenes/Imagen.js";
import { matchedData,validationResult,body } from 'express-validator';
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";
import {  broadcastMessage } from '../sse/utils.js';

export async function nuevoChat(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
    const datos = matchedData(req, { includeOptionals: true });
    const id_user_producto = parseInt(datos.id_user_producto);
    const id_user_sesion = parseInt(datos.id_user_sesion);
    const id = parseInt(datos.id);
    const nuevoChat = await Chat.crearChat(id_user_producto, id_user_sesion, id);
    if (nuevoChat) {
        res.redirect(`/chats/chat/${nuevoChat.id}`);
    } else {
        res.status(500).send("Error al crear el chat");
    }

}

export async function viewChat(req, res) {
   const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        return res.status(400).json({ status: 400, errores });
    }
  const datos = matchedData(req, { includeOptionals: true });
  const id =datos.id;
  const chat = await Chat.getChatById(id);
  let otherUserId = req.session.user_id;
  if(!chat) {
    return res.status(404).send("Chat no encontrado");
  }
  if(chat.usuario1 !== req.session.user_id) {
     otherUserId = chat.usuario1;
  }else{
    otherUserId = chat.usuario2;
  }
  const usuario = await Usuario.getUsuarioById(otherUserId);
      if(!usuario) {
          return res.status(404).send("Usuario no encontrado");
      }
  const producto = await Producto.getProductById(chat.producto);
      if(!producto) {
          return res.status(404).send("Producto no encontrado");
      }
  const imagenes = Imagen.getImagenByProductId(chat.producto);
      if(!imagenes) {
          return res.status(404).send("Imagenes no encontradas");
      }

    const mensajes = await Chat.getMensajesByChatId(id);
      if(!mensajes) {
          return mensajes=[];
      }
    const params = {
      contenido: "paginas/chats/chat",
      session: req.session,
      chat,
      otherUserName : usuario.nombre,
      productName : producto.nombre,
      productId : producto.id,
      imagenes,
      mensajes
    };
    res.render("pagina", params);
}
export async function viewMisChats(req, res) {
 
  const chats = await Chat.getChatsByUserId(parseInt(req.session.user_id));
 
  const params = {
    contenido: "paginas/chats/misChats",
    session: req.session,
    chats
    
  };
  res.render("pagina", params);
}
export async function enviarMensaje(req, res) {
  const datos = matchedData(req, { includeOptionals: true });
  const result = validationResult(req);
   if (!result.isEmpty()) {
    const errores = result.mapped();
    const datos = matchedData(req);
    return res.redirect(`/chats/chat/${datos.id_chat}`);
  }
  const nuevoMensaje = await Chat.enviarMensaje(datos.id_chat, datos.mensaje, req.session.user_id);
  res.redirect(`/chats/chat/${datos.id_chat}`);
}

export async function enviarMensajeJS(req, res) {
  const result = validationResult(req);
  const datos = matchedData(req, { includeOptionals: true });
  if (!result.isEmpty()) {
    const errores = result.mapped();
    const datos = matchedData(req);
    return res.status(400).json({ status: 400, errores });
  }
  try{
    const nuevoMensaje = await Chat.enviarMensaje(datos.id_chat, datos.mensaje, req.session.user_id);
    // Construir el JSON para el broadcast
    const mensajeBroadcast = JSON.stringify({
      senderId: req.session.user_id,
      contenido: datos.mensaje,
  });
    broadcastMessage( // Mensaje enviado a todos los sockets
      mensajeBroadcast,
      { categoria:datos.id_chat }
    );
    res.status(200).send('Mensaje enviado');
  }catch(e){
    logger.error("Error al enviar el mensaje", e);
    return res.status(500).send("Error al enviar el mensaje");
  }
 
}


export async function eliminarChat(req, res) {
  const datos=matchedData(req, { includeOptionals: true });
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errores = result.mapped();
    const datos = matchedData(req);
    return res.status(400).json({ status: 400, errores });
  }
  try {
    logger.debug("Eliminando chat:", datos.id);
    Chat.eliminarChat(parseInt(datos.id),parseInt(req.session.user_id));
    res.redirect("/chats/misChats");
  } catch (e) {
    res.status(400).send(e.message);
  }
}