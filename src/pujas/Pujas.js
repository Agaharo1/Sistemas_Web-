import { db } from '../db.js'; // Asegúrate de tener acceso a tu base de datos
import { logger } from '../logger.js';

/*
Atributos de Pujas:
-> id: id de la puja
-> valor: valor actual de la puja
-> id_user: el id de la persona que ha realizado la mayor puja hasta el momento
-> productoId: el id del producto por el que se está pujando
*/

export class Pujas {
  static #insertPujaStmt = null;
  static #getPujasByUserIdStmt = null;
  static #getPujaByIdStmt = null;
  static #getLastPujaStmt = null;
  static #getProductoByIdStmt = null;

  static initStatements(db) {
    if (this.#getPujasByUserIdStmt !== null) return;
    this.#getPujasByUserIdStmt = db.prepare(
      "SELECT p.productoId, p.producto, p.imagen, MAX(pa.valor) AS lastPuja " +
      "FROM Pujas p " +
      "LEFT JOIN PujasActivas pa ON p.productoId = pa.productoId " +
      "WHERE pa.usuarioId = @usuarioId " +
      "GROUP BY p.productoId"
    );

    // Método para obtener la última puja de un producto
    this.#getLastPujaStmt = db.prepare(
      "SELECT valor FROM PujasActivas WHERE productoId = @productoId ORDER BY id DESC LIMIT 1"
    );

    this.#getPujaByIdStmt = db.prepare(
      "SELECT id, usuario1, usuario2, producto FROM Chats WHERE id = @id_chat"
    );
  }

  static getPujasByUserId(usuarioId) {
    const pujas = this.#getPujasByUserIdStmt.all({ usuarioId });
    return pujas || [];
  }

  static getProductoById(productoId) {
     return this.#getProductoByIdStmt.get({ productoId });
  }

  static getLastPuja(productoId) {
    const puja = this.#getLastPujaStmt.get({ productoId });
    return puja ? puja.valor : 0; // Retorna el valor de la última puja
  }
  
  // Enviar una nueva puja
  static enviarPuja(chatId, cantidad, usuarioId) {
    const productoId = this.getProductoIdByChatId(chatId); // Lógica para obtener el producto asociado a este chat

    // Verifica que la puja no esté vacía
    if (cantidad <= 0) {
      logger.error("Intento de puja con cantidad inválida:", cantidad);
      return false;
    }

    const { lastInsertRowid } = this.#insertPujaStmt.run({ chatId, cantidad, usuarioId, productoId });
    logger.debug("Puja registrada con éxito:", lastInsertRowid);
    return { id: lastInsertRowid, chatId, cantidad, usuarioId, productoId };
  }

  // Obtener todas las pujas hechas por un usuario
  static getPujasByUserId(usuarioId) {
    const pujas = this.#getPujasByUserIdStmt.all({ usuarioId });
    return pujas;
  }

  // Método adicional para obtener el ID del producto de un chat (supongamos que tienes una lógica para esto)
  static getProductoIdByChatId(chatId) {
    // Aquí puede ir la lógica para obtener el producto por el `chatId`.
    // Supongamos que el `chatId` contiene información que nos permite identificar el `productoId` asociado.
    return 123; // Producto ficticio para el ejemplo
  }
}