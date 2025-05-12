
export class PuntoRecogida {
  static #getAllStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;
  static #deleteStmt = null;
  static #getByIdStmt = null;


  provincia;
  direccion;
  id;
  

  constructor(id,provincia,direccion= null) {
    this.provincia = provincia;
    this.direccion = direccion;
    this.id = id;
    
  }

  static initStatements(db) {

    if (this.#getAllStmt !== null) return;
    this.#getAllStmt = db.prepare(
      "SELECT id, provincia, direccion FROM puntoRecogida"
    );
    this.#insertStmt = db.prepare(
      "INSERT INTO puntoRecogida(provincia, direccion) VALUES (@provincia, @direccion)"
    );
    this.#updateStmt = db.prepare(
      "UPDATE puntoRecogida SET provincia = @provincia, direccion = @direccion WHERE id = @id"
    );
    this.#deleteStmt = db.prepare("DELETE FROM puntoRecogida WHERE id = @id");
    this.#getByIdStmt = db.prepare(
      "SELECT id, provincia, direccion FROM puntoRecogida WHERE id = @id"
    );
  }

   static getPuntoRecogidaById(id) {
    return this.#getAllStmt.all();
  }


    static getPuntoRecogidaByOneId(id) {
      return this.#getByIdStmt.get({ id });
  }

    
}

export class PuntoNoEncontrado extends Error {
    /**
     *
     * @param {string} nombre
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
      super(`Producto no encontrado: ${nombre}`, options);
      this.name = "PuntoNoEncontrado";
    }
  }
  