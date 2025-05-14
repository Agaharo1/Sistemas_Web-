import { logger } from '../logger.js';
import { Imagen } from '../imagenes/Imagen.js';
import {Producto} from '../productos/Productos.js'
import {Usuario} from '../usuarios/Usuario.js'

export class Puja {
  static #getByUserIdStmt = null;
  static #getAllStmt = null;
  static #getPujarStmt = null;
  static #getPujaByProductIdStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;
  static #deleteStmt = null;
  static #insertPujarStmt = null;
  static #lastPujarIdStmt = null;
  static #getPujaByIdStmt = null;
  static #deletePujaStmtProductId = null;
  static #getPujasStmt = null;
  static #selectPujaStmtProductId = null;
  static #updateValorMax = null;
  static #getExpiradasStmt = null;
  static #deletePujarByPujaIdStmt = null;

  valor_max;
  id_u;
  id;
  #id_p;

  constructor({ id_producto, id = null, id_u = null, valor_max = 0 }) {
    this.id = id;
    this.#id_p = id_producto;
    this.id_u = id_u;
    this.valor_max = valor_max;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;

    this.#getByUserIdStmt = db.prepare(`SELECT * FROM Puja WHERE id_u = @usuario`);
    this.#deletePujarByPujaIdStmt = db.prepare(`DELETE FROM Pujar WHERE id_puja = @id_puja`);
    this.#getAllStmt = db.prepare(`SELECT * FROM Puja`);
    this.#getPujaByProductIdStmt = db.prepare(`SELECT * FROM Puja WHERE producto = @id_producto`);
    this.#getPujaByIdStmt = db.prepare(`SELECT * FROM Puja WHERE id = @id_puja`);
    this.#insertStmt = db.prepare(`INSERT INTO Puja(producto, id_u, valor_max, fecha_limite) VALUES (@producto, @usuario, @valor_max, @fecha_limite)`);
    this.#updateStmt = db.prepare(`UPDATE Puja SET id_u = @id_u WHERE producto = @id_p`);
    this.#deleteStmt = db.prepare(`DELETE FROM Puja WHERE id = @id`);
    this.#deletePujaStmtProductId = db.prepare(`DELETE FROM Puja WHERE producto = @productId`);
    this.#selectPujaStmtProductId = db.prepare(`SELECT id FROM Puja WHERE producto = @id_producto`);
    this.#insertPujarStmt = db.prepare(`INSERT INTO Pujar(id_puja, valor, id_u) VALUES (@id_puja, @valor, @id_u)`);
    this.#getPujasStmt = db.prepare(`SELECT valor, id_u FROM Pujar WHERE id_puja = @id_puja`);
    this.#lastPujarIdStmt = db.prepare(`SELECT id FROM Pujar WHERE id_puja = @id_puja ORDER BY id DESC LIMIT 1`);
    this.#updateValorMax = db.prepare(`UPDATE Puja SET valor_max = @valor_max, id_u = @id_u WHERE id = @id_puja`);
    this.#getExpiradasStmt = db.prepare(`SELECT * FROM Puja WHERE fecha_limite <= @ahora`);
  }

  // Obtener todas las pujas de un usuario
  static getPujaByUser(id_user_sesion) {
    const pujas = this.#getByUserIdStmt.all({ usuario: id_user_sesion });
    if (!pujas || pujas.length === 0) {
      logger.debug("No hay pujas para el usuario:", id_user_sesion);
      return [];
    }
    logger.debug("Pujas del usuario:", pujas);
    return pujas;
  }

  // Obtener una puja por ID
  static getPujaById(id_puja) {
    const puja = this.#getPujaByIdStmt.get({ id_puja });
    if (!puja) throw new PujaNoEncontrada(id_puja);
    logger.debug("Puja encontrada:", puja);
    return puja;
  }

  // Obtener todas las pujadas asociadas a una puja
  static getPujadasByPujaId(id_puja) {
    const pujadas = this.#getPujasStmt.all({ id_puja });
    logger.debug("Pujadas encontradas:", pujadas);
    return pujadas;
  }

  // Obtener todas las pujas por producto
  static getPujaByProductId(id_producto) {
    const pujas = this.#getPujaByProductIdStmt.all({ id_producto });
    if (!pujas || pujas.length === 0) {
      logger.debug("No existe puja para este producto:", id_producto);
      return [];
    }
    return pujas;
  }

  // Insertar una nueva puja
  static crearPuja(id_u, id_producto, valor_max) {
    const fecha_limite = Date.now() + 60_0000; // 1 minuto desde ahora
    const nuevaPuja = new Puja({ id_producto, id_u, valor_max });

    const info = this.#insertStmt.run({
      producto: id_producto,
      usuario: id_u,
      valor_max,
      fecha_limite
    });

    nuevaPuja.id = info.lastInsertRowid || info.lastID;
    return nuevaPuja;
  }

  static getPujasExpiradas(ahora) {
    return this.#getExpiradasStmt.all({ ahora });
  }

  // Ejecutar una nueva pujada y actualizar el valor máximo
  static pujar(id_puja, valor, id_u) {
    const nuevaPujada = { id_puja, valor, id_u };
    const { lastInsertRowid } = this.#insertPujarStmt.run(nuevaPujada);
    nuevaPujada.id = lastInsertRowid;

    this.updateValorMaximo(valor, id_puja, id_u);
    return nuevaPujada;
  }

  // Actualizar valor máximo de la puja
  static updateValorMaximo(valor_max, id_puja, id_u) {
    return this.#updateValorMax.run({ valor_max, id_puja, id_u });
  }

  // Eliminar una puja por ID
  static eliminarPuja(id) {

    // Borra primero todas las pujadas relacionadas
    this.#deletePujarByPujaIdStmt.run({ id_puja: id });

    const result = this.#deleteStmt.run({ id });
    logger.info(`Puja eliminada: ${id}, filas afectadas: ${result.changes}`);
  }

  // Eliminar una puja por ID de producto
  static eliminarPujaByProduct(productId) {
    const puja = this.#selectPujaStmtProductId.all({ id_producto: productId });
    if (!puja || puja.length === 0) {
      return logger.debug("No se ha encontrado ninguna puja para este producto:", productId);
    }

    const result = this.#deletePujaStmtProductId.run({ productId });
    logger.debug("Puja eliminada:", result.changes);
  }

  // Insertar o actualizar una puja
  persist() {
    return this.id === null ? Puja.#insert(this) : Puja.#update(this);
  }

  // Inserta la puja en la BDD
  static #insert(puja) {
    const producto = puja.#id_p;
    const id_u = puja.id_u;
    const valor_max = puja.valor_max;

    const info = this.#insertStmt.run({ producto, usuario: id_u, valor_max });
    puja.id = info.lastInsertRowid || info.lastID;
    return puja;
  }

  // Actualiza la puja existente
  static #update(puja) {
    const producto = puja.#id_p;
    const id_u = puja.id_u;

    this.#updateStmt.run({ id_p: producto, id_u });
    return puja;
  }
}

export class PujaNoEncontrada extends Error {
  constructor(id, options) {
    super(`Puja no encontrada: ${id}`, options);
    this.name = "PujaNoEncontrada";
  }
}


