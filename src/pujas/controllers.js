import { Pujas } from './Pujas.js';
import { Producto } from '../productos/Productos.js';
import { Imagen } from '../imagenes/Imagen.js';
import { Chat } from '../chat/Chat.js';

export function nuevaPuja(req, res) {
  const { id} = req.params;
  const { id_user_producto, id_user_sesion } = req.query;
  
  //Comprobamos si ya existe una puja para este producto
  const pujaExistente = Pujas.getPujasById(id)
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

export function enviarPuja(req, res) {
  const { id_chat, cantidad, senderId } = req.body;
  const nuevaPuja = Pujas.enviarPuja(id_chat, cantidad, senderId);
  res.json({ success: true, puja: nuevaPuja });
}

export function verPujas(req, res) {
  const { id_chat } = req.params;
  const pujas = Pujas.getPujasByChatId(id_chat);
  res.json(pujas);
}

export function viewMisPujas(req, res) {
    const userId = parseInt(req.session.user_id);
  
    // Obtenemos todas las pujas hechas por el usuario
    const pujas = Pujas.getPujasByUserId(userId);
  
    // Agregamos información adicional de producto y chat si lo necesitas en la vista
    const pujasConDetalles = pujas.map(puja => {
      const producto = Producto.getProductById(puja.productoId);
      const imagenes = Imagen.getImagenByProductId(puja.productoId);
      const chat = Chat.getChatById(puja.chatId);
  
      return {
        ...puja,
        productoNombre: producto?.nombre || "Producto eliminado",
        imagen: imagenes?.[0]?.ruta || null,
        chatId: chat?.id || null
      };
    });
  
    const params = {
      contenido: "paginas/pujas/misPujas",
      session: req.session,
      pujas: pujasConDetalles
    };
  
    res.render("pagina", params);
  }

export function enviarPuja(req, res) {
    const { cantidad, chatId } = req.body;
    const usuarioId = req.session.user_id;
  
    if (!cantidad || !chatId || !usuarioId) {
      return res.status(400).send("Datos incompletos para la puja.");
    }
  
    const puja = Pujas.enviarPuja(parseInt(chatId), parseFloat(cantidad), parseInt(usuarioId));
    if (!puja) {
      return res.status(500).send("Error al registrar la puja.");
    }
  
    res.redirect(`/chats/chat/${chatId}`);
  }
