import { logger } from '../logger.js';
import { Imagen } from '../imagenes/Imagen.js';
export class Chat{
    static #getByUserIdStmt = null;
    static #getMessagesStmt = null;
    static #getChatByProductIdStmt = null;
    static #getAllStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;
    static #deleteUserFromChatStmt = null;
    static #insertMensajeStmt = null;
    static #deleteMensajeStmt = null;
    static #lastMensajeChatIdStmt = null;
    static #chatByIdStmt = null;
    static #deleteMensajeStmtChatId = null;
    static #deleteChatStmtProductId = null;
    static #selectChatStmtProductId = null;
    
  
    id_2;
    id_1;
    id;
    #id_p;

    constructor(id_producto, id = null, id_1 = null, id_2 = null) {
        this.id = id;
        this.#id_p = id_producto;
        this.id_1 = id_1;
        this.id_2 = id_2;
    }
    static initStatements(db) {
        if (this.#getByUserIdStmt !== null) return;
        this.#getByUserIdStmt = db.prepare(
          `SELECT c.id as chatId,c.producto as producto, 
              CASE 
            WHEN c.usuario1 = @idUsuario THEN u2.nombre 
            ELSE u1.nombre 
              END AS nombre,
              (SELECT contenido 
               FROM Mensajes m 
               WHERE m.chatId = c.id 
               ORDER BY m.id DESC 
               LIMIT 1) AS lastMensaje
           FROM Chats c
           LEFT JOIN Usuarios u1 ON c.usuario1 = u1.id
           LEFT JOIN Usuarios u2 ON c.usuario2 = u2.id
           WHERE (c.usuario1 = @idUsuario OR c.usuario2 = @idUsuario)`
        );
        this.#selectChatStmtProductId = db.prepare(
          "SELECT id FROM Chats WHERE producto = @id_producto"
        );
        this.#insertStmt = db.prepare(
          "INSERT INTO Chats(producto, usuario1, usuario2) VALUES (@producto, @usuario1, @usuario2)"
        );
        this.#updateStmt = db.prepare(
          "UPDATE Chats SET usuario1 = @usuario1, usuario2 = @usuario2 WHERE producto = @producto"
        );
        this.#deleteUserFromChatStmt = db.prepare(
          "UPDATE Chats SET usuario1 = CASE WHEN usuario1 = @usuario THEN 0 ELSE usuario1 END, usuario2 = CASE WHEN usuario2 = @usuario THEN 0 ELSE usuario2 END WHERE (usuario1 = @usuario OR usuario2 = @usuario) AND id = @id_chat"
        );
        this.#getAllStmt = db.prepare(
            "SELECT id, usuario1, usuario2, producto FROM Chats"
        );
        this.#deleteStmt = db.prepare(
            "DELETE FROM Chats WHERE usuario1 = 0 AND usuario2 = 0 AND id = @chatId"
        );
        this.#deleteChatStmtProductId = db.prepare(
            "DELETE FROM Chats WHERE producto = @productId"
        );
        this.#getMessagesStmt = db.prepare(
            "SELECT contenido, senderId FROM Mensajes WHERE chatId = @id_chat"
        );
        this.#insertMensajeStmt = db.prepare(
            "INSERT INTO Mensajes(chatId, contenido, senderId) VALUES (@id_chat, @contenido, @senderId)"
        );
        this.#deleteMensajeStmt = db.prepare(
            "DELETE FROM Mensajes WHERE chatId = @id_chat AND chatId IN (SELECT id FROM Chats WHERE usuario1 = 0 AND usuario2 = 0)"
        );
        this.#lastMensajeChatIdStmt = db.prepare(
            "SELECT id FROM Mensajes WHERE chatId = @id_chat ORDER BY id DESC LIMIT 1"
        );
        this.#getChatByProductIdStmt = db.prepare(
            "SELECT id, usuario1, usuario2, producto FROM Chats WHERE producto = @id_producto AND (usuario1 = @id_usuario OR usuario2 = @id_usuario)"
        );
        this.#chatByIdStmt = db.prepare(
            "SELECT id, usuario1, usuario2, producto FROM Chats WHERE id = @id_chat"
        );
       this.#deleteMensajeStmtChatId = db.prepare(
            "DELETE FROM Mensajes WHERE chatId = @chatId"
        );
    }  

    static async userPerteneceChat(id_chat,id_usuario) {
        const chat = this.#chatByIdStmt.get({ id_chat });
        if (chat === undefined) return false;
        if (chat.usuario1 === id_usuario || chat.usuario2 === id_usuario) {
            logger.debug("El usuario pertenece al chat:", chat);
            return true;
        } else {
            logger.debug("El usuario no pertenece al chat:", chat);
            return false;
        }
    }
    
    static eliminarChat(chatId, usuarioId) {
        //Eliminar el chat de la tabla Chats (borrar usuario de la conversacion)
        const eliminado=this.#deleteUserFromChatStmt.run({ usuario: usuarioId, id_chat: chatId });
        if (eliminado.changes === 0)
            return logger.debug("No se ha eliminado el chat:", chatId);
        //Eliminar los mensajes de la tabla Mensajes (borrar mensajes del chat si los dos usuarios lo han eliminado)
        const eliminarMensajes = this.#deleteMensajeStmt.run({ id_chat:chatId });

            //Eliminar el chat de la tabla Chats (borrar el chat si los dos usuarios lo han eliminado)
            const result = this.#deleteStmt.run({ chatId:chatId });
           
            logger.debug("Chat eliminado:", result.changes);
        
      }

    static eliminarChatByProduct(productId){
        //Guardamos los ids de los chats que se eliminan
        let chats = this.#selectChatStmtProductId.all({id_producto:productId});
        if(chats === undefined) return logger.debug("No se han encontrado chats para eliminar:", productId);
        
        //Eliminamos los mensajes de la tabla Mensajes
        chats.forEach(chat => {
            const eliminarMensajes = this.#deleteMensajeStmtChatId.run({ chatId: chat.id });
        });

        //Eliminamos los chats de la tabla Chats
        const result = this.#deleteChatStmtProductId.run({productId: productId });
        logger.debug("Chats eliminado:", result.changes);
    }
    static getChatByUsers(id_user_producto, id_user_sesion, id_producto) {
        const chat = this.#getChatByProductIdStmt.all({id_usuario:id_user_producto, id_producto});
        if (chat === undefined)return null;
        const chatExistente = chat.find(
            (chat) =>
              ((chat.usuario1 === id_user_producto && chat.usuario2 === id_user_sesion) ||
              (chat.usuario1 === id_user_sesion && chat.usuario2 === id_user_producto))
              
          );
        if (chatExistente) {
            logger.debug("Chat existente:", chatExistente);
            return chatExistente;
        } else {
            return null;
        }
      }
    static getChatById(id_chat) {
        const chat = this.#chatByIdStmt.get({ id_chat });
        if (chat === undefined) throw new ChatNoEncontrado(id_chat);
        logger.debug("Chat encontrado:", chat);
        return chat;
      }
    static getChatsByUserId(id_usuario) {
        const id = id_usuario;
        let chats = this.#getByUserIdStmt.all({idUsuario:id});
        if (chats === undefined) throw new ChatNoEncontrado(id_usuario);
        chats.forEach(chat => {
            chat.imagen = Imagen.getImagenByProductId(chat.producto);
        });
        logger.debug("Chats encontrados:", chats);
        return chats;
      }
   
    static getMensajesByChatId(id_chat) {
        const Mensajes = this.#getMessagesStmt.all({ id_chat });
        logger.debug("Mensajes encontrados:", Mensajes);
        return Mensajes;
      }
    #insert(chat) 
    {
        const producto = chat.#id_p;
        const usuario1 = chat.id_1;
        const usuario2 = chat.id_2;
        const { lastInsertRowid } = Chat.#insertStmt.run({ producto:producto, usuario1:usuario1, usuario2:usuario2 });
        chat.id = lastInsertRowid;
        return chat;
      }

    #update(chat) {
        const producto = chat.#id_p;
        const usuario1 = chat.id_1;
        const usuario2 = chat.id_2;
        chat.#updateStmt.run({ producto, usuario1, usuario2 });
        return chat;
      }

    static crearChat(usuario1, usuario2, id_p,id) {
        const nuevoChat = new Chat( id_p, id, usuario1, usuario2);
        console.log("Chat creado:", nuevoChat);
        return nuevoChat.persist();
      }
    
    static enviarMensaje(id_chat, contenido, senderId) {
        const nuevoMensaje = { id_chat, contenido, senderId };
        const { lastInsertRowid } = this.#insertMensajeStmt.run(nuevoMensaje);
        nuevoMensaje.id = lastInsertRowid;
        return nuevoMensaje;
      }
    persist() {
        if (this.id === null) return this.#insert(this);
        return this.#update(this);
      }

}

export class ChatNoEncontrado extends Error {
    /**
     *
     * @param {string} id
     * @param {ErrorOptions} [options]
     */
    constructor(id, options) {
      super(`Chat no encontrado: ${id}`, options);
      this.name = "ChatNoEncontrada";
    }
  }