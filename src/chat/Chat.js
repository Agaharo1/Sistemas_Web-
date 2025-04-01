import { logger } from '../logger.js';
export class Chat{
    static #getByUserIdStmt = null;
    static #getMessagesStmt = null;
    static #getAllStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;
    static #deleteUserFromChatStmt = null;
    static #insertMensajeStmt = null;
    static #deleteMensajeStmt = null;
    id_2;
    id_1;
    #id;
    #id_p;

    constructor(id_producto, id = null, id_1 = null, id_2 = null) {
        this.#id = id;
        this.#id_p = id_producto;
        this.id_1 = id_1;
        this.id_2 = id_2;
    }
    static initStatements(db) {
        if (this.#getByUserIdStmt !== null) return;
        this.#getByUserIdStmt = db.prepare(
          "SELECT id, usuario1, usuario2 FROM Chats WHERE (usuario1 = @idUsuario OR usuario2 = @idUsuario)"
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
        this.#getMessagesStmt = db.prepare(
            "SELECT contenido, senderId FROM Mensajes WHERE chatId = @id_chat"
        );
        this.#insertMensajeStmt = db.prepare(
            "INSERT INTO Mensajes(chatId, contenido, senderId) VALUES (@id_chat, @contenido, @senderId)"
        );
        this.#deleteMensajeStmt = db.prepare(
            "DELETE FROM Mensajes WHERE chatId = @id_chat AND chatId IN (SELECT id FROM Chats WHERE usuario1 = 0 AND usuario2 = 0)"
        );

    }  
    
    static eliminarChat(chatId, usuarioId) {
        //Eliminar el chat de la tabla Chats (borrar usuario de la conversacion)
        const eliminado=this.#deleteUserFromChatStmt.run({ usuario: usuarioId, id_chat: chatId });
        if (eliminado.changes === 0) throw new ChatNoEncontrado(chatId);
        //Eliminar los mensajes de la tabla Mensajes (borrar mensajes del chat si los dos usuarios lo han eliminado)
        const eliminarMensajes = this.#deleteMensajeStmt.run({ chatId });
        if (eliminarMensajes.changes === 0) throw new ChatNoEncontrado(chatId);
        else{
            //Eliminar el chat de la tabla Chats (borrar el chat si los dos usuarios lo han eliminado)
            const result = this.#deleteStmt.run({ chatId });
        }
      }

    static getChatsByUserId() {
        const Chats = this.#getByUserIdStmt.all();
        if (Chats === undefined) throw new ChatNoEncontrado(id_usuario);
        logger.debug("Chats encontrados:", Chats);
        return Chats;
      }
    static getMensajesByChatId(id_chat) {
        const Mensajes = this.#getMessagesStmt.all({ id_chat });
        if (Mensajes === undefined) throw new ChatNoEncontrado(id_chat);
        logger.debug("Mensajes encontrados:", Mensajes);
        return Mensajes;
      }
    #insert(chat) 
    {
        const producto = chat.#id_p;
        const usuario1 = chat.id_1;
        const usuario2 = chat.id_2;
        const { lastInsertRowid } = chat.#insertStmt.run({ producto, usuario1, usuario2 });
        chat.#id = lastInsertRowid;
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
        if (this.#id === null) return Imagen.#insert(this);
        return Imagen.#update(this);
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