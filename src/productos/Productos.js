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

  constructor(nombre, descripcion, precio, id = null,id_u) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.#id = id;
    this.#id_u = id_u;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;
    this.#getByUserIdStmt = db.prepare(
      "SELECT id, nombre, descripcion, precio FROM productos WHERE id_user = @id_u"
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
    const productos = this.#getByUserIdStmt.all({ id_u });
    if (productos === undefined) throw new ProductoNoEncontrado(nombre);
    
    return productos;
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
    const datos = {nombre,descripcion,precio,id_u};
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

  static crearProducto(nombre, descripcion, precio,id_u) {
    const Tproducto = new Producto(nombre, descripcion, precio,id_u);
    
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
