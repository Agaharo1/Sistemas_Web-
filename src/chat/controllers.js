
import { config } from "../config.js";
import {Chat} from "../chat/Chat.js";
import { Imagen } from "../imagenes/Imagen.js";
import { body } from "express-validator";
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";

export function nuevoChat(req, res) {
    const { id} = req.params;
    const { id_user_producto, id_user_sesion } = req.query;
    
    //Comprobamos si ya existe un chat entre los dos usuarios
    const chatExistente = Chat.getChatByUsers(id_user_producto, id_user_sesion, id);
    if (chatExistente !== null) {
        //Si existe, redirigimos al chat existente
        return res.redirect(`/chats/chat/${chatExistente.id}`);
    }
    const nuevoChat = Chat.crearChat(id_user_producto, id_user_sesion, id);

    if (nuevoChat) {
        res.redirect(`/chats/chat/${nuevoChat.id}`);
    } else {
        res.status(500).send("Error al crear el chat");
    }

}

export function viewChat(req, res) {
  const { id } = req.params;
  const chat = Chat.getChatById(id);
  let otherUserId = req.session.user_id;
  if(!chat) {
    return res.status(404).send("Chat no encontrado");
  }
  if(chat.usuario1 !== req.session.user_id) {
     otherUserId = chat.usuario1;
  }else{
    otherUserId = chat.usuario2;
  }
const usuario = Usuario.getUsuarioById(otherUserId);
    if(!usuario) {
        return res.status(404).send("Usuario no encontrado");
    }
const producto = Producto.getProductById(chat.producto);
    if(!producto) {
        return res.status(404).send("Producto no encontrado");
    }
const imagenes = Imagen.getImagenByProductId(chat.producto);
    if(!imagenes) {
        return res.status(404).send("Imagenes no encontradas");
    }

  const mensajes = Chat.getMensajesByChatId(id);
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
export function viewMisChats(req, res) {
 
  const chats = Chat.getChatsByUserId(parseInt(req.session.user_id));
 
  const params = {
    contenido: "paginas/chats/misChats",
    session: req.session,
    chats
    
  };
  res.render("pagina", params);
}
export function enviarMensaje(req, res) {
  const { mensaje, id_chat,senderId } = req.body;
  const nuevoMensaje = Chat.enviarMensaje(id_chat, mensaje, senderId);
  res.redirect(`/chats/chat/${id_chat}`);
}

export function eliminarChat(req, res) {
  const { id } = req.params;
  try {
    console.log("Eliminando chat:", id);
    Chat.eliminarChat(parseInt(id),parseInt(req.session.user_id));
    res.redirect("/chats/misChats");
  } catch (e) {
    res.status(400).send(e.message);
  }
}