import { logger } from '../logger.js';

export class Puja {
  static #getByUserIdStmt = null;
  static #getByOwnerStmt = null;
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
  precio_salida;
  propietario;
  #id_p;

  constructor({ id_producto, id = null, id_u = null, valor_max = 0, precio_salida = 0, propietario = null }) {
    this.id = id;
    this.#id_p = id_producto;
    this.id_u = id_u;
    this.valor_max = valor_max;
    this.precio_salida = precio_salida;
    this.propietario = propietario;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;

    this.#getByUserIdStmt = db.prepare(`SELECT * FROM Puja WHERE id_u = @usuario`);
    this.#getByOwnerStmt = db.prepare(`SELECT * FROM Puja WHERE propietario = @id_propietario`);
    this.#deletePujarByPujaIdStmt = db.prepare(`DELETE FROM Pujar WHERE id_puja = @id_puja`);
    this.#getAllStmt = db.prepare(`SELECT * FROM Puja`);
    this.#getPujaByProductIdStmt = db.prepare(`SELECT * FROM Puja WHERE producto = @id_producto`);
    this.#getPujaByIdStmt = db.prepare(`SELECT * FROM Puja WHERE id = @id_puja`);
    this.#insertStmt = db.prepare(`INSERT INTO Puja(producto, id_u, valor_max, fecha_limite, precio_salida, propietario) VALUES (@producto, @usuario, @valor_max, @fecha_limite, @precio_salida, @propietario)`);
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

  static getPujaByUser(id_user_sesion) {
    const pujas = this.#getByUserIdStmt.all({ usuario: id_user_sesion });
    if (!pujas || pujas.length === 0) {
      logger.debug("No hay pujas para el usuario:", id_user_sesion);
      return [];
    }
    return pujas;
  }

  static getPujaByPropietario(id_propietario) {
    return this.#getByOwnerStmt.all({ id_propietario });
  }

  static getPujaById(id_puja) {
    const puja = this.#getPujaByIdStmt.get({ id_puja });
    if (!puja) throw new PujaNoEncontrada(id_puja);
    return puja;
  }

  static getPujadasByPujaId(id_puja) {
    return this.#getPujasStmt.all({ id_puja });
  }

  static getPujaByProductId(id_producto) {
    return this.#getPujaByProductIdStmt.all({ id_producto }) || [];
  }

  static crearPuja(propietario, id_producto, precio_salida) {
    const fecha_limite = Date.now() + 60_0500; // Esto se puede modificar
    const nuevaPuja = new Puja({ id_producto, id_u: null, precio_salida });
  
    const info = this.#insertStmt.run({
      producto: id_producto,
      usuario: null,
      valor_max: precio_salida,
      fecha_limite,
      precio_salida,
      propietario
    });
  
    nuevaPuja.id = info.lastInsertRowid || info.lastID;
    return nuevaPuja;
  }


  static getPujasExpiradas(ahora) {
    return this.#getExpiradasStmt.all({ ahora });
  }

  static pujar(id_puja, valor, id_u) {
    const nuevaPujada = { id_puja, valor, id_u };
    const { lastInsertRowid } = this.#insertPujarStmt.run(nuevaPujada);
    nuevaPujada.id = lastInsertRowid;

    this.updateValorMaximo(valor, id_puja, id_u);
    return nuevaPujada;
  }

  static updateValorMaximo(valor_max, id_puja, id_u) {
    return this.#updateValorMax.run({ valor_max, id_puja, id_u });
  }

  static eliminarPuja(id) {
    this.#deletePujarByPujaIdStmt.run({ id_puja: id });
    const result = this.#deleteStmt.run({ id });
    logger.info(`Puja eliminada: ${id}, filas afectadas: ${result.changes}`);
  }

  static eliminarPujaByProduct(productId) {
    this.#deletePujaStmtProductId.run({ productId });
  }

  persist() {
    return this.id === null ? Puja.#insert(this) : Puja.#update(this);
  }

  static #insert(puja) {
    const producto = puja.#id_p;
    const id_u = puja.id_u;
    const valor_max = puja.valor_max;
    const precio_salida = puja.precio_salida;
    const propietario = puja.propietario;
    const fecha_limite = Date.now() + 60_000;

    const info = this.#insertStmt.run({
      producto,
      usuario: id_u,
      valor_max,
      fecha_limite,
      precio_salida,
      propietario
    });

    puja.id = info.lastInsertRowid || info.lastID;
    return puja;
  }

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
