export class Producto {
  static #getByUserIdStmt = null;
  static #getAllStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;

  nombre;
  descripcion;
  precio;
  #id;
  #id_u;

  constructor(nombre, descripcion, precio, id = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.#id = id;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;
    this.#getByUserIdStmt = db.prepare(
      "SELECT id, nombre, descripcion, precio FROM productos WHERE nombre = @nombre"
    );
    this.#insertStmt = db.prepare(
      "INSERT INTO productos(nombre, descripcion, precio) VALUES (@nombre, @descripcion, @precio)"
    );
    this.#updateStmt = db.prepare(
      "UPDATE productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio WHERE id = @id"
    );
    this.#getAllStmt = db.prepare("SELECT nombre,descripcion, precio FROM productos"); 
}

  static getProductByUserId(id_u) {
    const producto = this.#getByUserIdStmt.get({ id_u });
    if (producto === undefined) throw new ProductoNoEncontrado(nombre);

    const { id, password, nombre, rol } = producto;
    console.log("Producto recibido de la BD:", producto);
    return new Producto(nombre, descripcion, precio);
  }
  static getProducts() {
    const productos = this.#getAllStmt.all();
    return productos;
  }

  static #insert(producto) {
    let result = null;
    const nombre = producto.nombre;
    const descripcion = producto.descripcion;
    const precio = producto.precio;
    const id_u = producto.#id_u;
    const datos = {nombre,descripcion,precio};
    console.log("Producto insertado:", datos);
    result = this.#insertStmt.run(datos);

    producto.#id = result.lastInsertRowid;

    return producto;
  }
  static #update(producto) {
    const nombre = producto.nombre;
    const descripcion = producto.descripcion;
    const precio = producto.precio;
    const datos = { nombre, descripcion, precio };

    const result = this.#updateStmt.run(datos);
    if (result.changes === 0) throw new ProductoNoEncontrado(username);
    return usuario;
  }

  static crearProducto(nombre, descripcion, precio) {
    const Tproducto = new Producto(nombre, descripcion, precio);
    Tproducto.nombre = nombre;
    console.log("Producto creado:", Tproducto.nombre);

    return Tproducto.persist();
  }

  persist() {
    if (this.#id === null) return Producto.#insert(this);
    return Producto.#update(this);
  }
}

export class ProductoNoEncontrado extends Error {
  /**
   *
   * @param {string} nombre
   * @param {ErrorOptions} [options]
   */
  constructor(nombre, options) {
    super(`Producto no encontrado: ${nombre}`, options);
    this.name = "ProductoNoEncontrado";
  }
}
