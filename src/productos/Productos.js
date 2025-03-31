import { Imagen } from "../imagenes/Imagen.js";
import fs from 'fs';
import path from 'path';

export class Producto {
  static #getByUserIdStmt = null;
  static #getAllStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;
  static #deleteStmt = null;
  static #getByIdStmt = null;
  

  nombre;
  descripcion;
  precio;
  id;
  id_u;

  constructor(nombre, descripcion, precio, id_u,id = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.id = id;
    this.id_u = id_u;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;
    this.#getByUserIdStmt = db.prepare(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
      FROM productos p 
      JOIN usuarios u ON p.id_user = u.id 
      JOIN Imagenes i ON i.id_producto = p.id WHERE id_user = @id_u`
    );
    this.#insertStmt = db.prepare(
      "INSERT INTO productos(nombre,id_user, descripcion, precio) VALUES (@nombre,@id_u, @descripcion, @precio)"
    );
    this.#updateStmt = db.prepare(
      "UPDATE productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio WHERE id = @id"
    );
    this.#getAllStmt = db.prepare(`SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id 
    `);
    this.#deleteStmt = db.prepare("DELETE FROM productos WHERE id = @id");
    this.#getByIdStmt = db.prepare(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id 
    WHERE p.id = @id`
    );
     
}

  static editarProducto(nombre, descripcion, precio, id) {
    
    const result =new Producto(nombre, descripcion, precio, null, id).persist();
    if(result.changes === 0) throw new ProductoNoEncontrado(id);
    return result;
  }

  static getProductById(id) {
    const producto = this.#getByIdStmt.get({ id });
    if (producto === undefined) throw new ProductoNoEncontrado(id);
    return producto;
  }
  static getProductByUserId(id_u) {
    const productos = this.#getByUserIdStmt.all({ id_u });
    if (productos === undefined) throw new ProductoNoEncontrado(nombre);
    
    return productos;
  }
  static getProducts() {
    const productos = this.#getAllStmt.all();
    if (productos === undefined) throw new ProductoNoEncontrado(nombre);
    console.log("Productos obtenidos:", productos);
    
    return productos;
  }

  static #insert(producto) {
    let result = null;
    const nombre = producto.nombre;
    const descripcion = producto.descripcion;
    const precio = producto.precio;
    const id_u = producto.id_u;
    const datos = {nombre,id_u,descripcion,precio};
    
    result = this.#insertStmt.run(datos);

    producto.id = result.lastInsertRowid;
    console.log("Id del producto insertado:", producto.id);
    console.log("Producto insertado:", result);
    return producto;
  }
  static #update(producto) {
    const nombre = producto.nombre;
    const descripcion = producto.descripcion;
    const precio = producto.precio;
    const id = producto.id;
    const datos = { nombre, descripcion, precio,id };

    const result = this.#updateStmt.run(datos);
    if (result.changes === 0) throw new ProductoNoEncontrado(username);
    return result;
  }

  static crearProducto(nombre, descripcion, precio, id_u, img, pathUpload) {
    const img2 = `${img}.jpg`; // Añadimos la extensión .jpg a la variable img
    const Tproducto = new Producto(nombre, descripcion, precio, id_u);
    const result = Tproducto.persist();
    const productoId = result.id;
    // Movemos la imagen a la carpeta correspondiente
    const oldPath = path.join(pathUpload, img);
    const newPath = path.join(pathUpload, productoId.toString(), `${img2}`); // Metemos la imagen en su carpeta
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    fs.renameSync(oldPath, newPath);
    // Creamos la imagen en la base de datos
    const imgRes = Imagen.crearImagen(img2, productoId, productoId, null);
    console.log("Imagen insertada:", imgRes);
    return result;
  }
  
  static eliminarProducto(id) {
    Imagen.eliminarImagen(id);
    const result = this.#deleteStmt.run({ id });
    if (result.changes === 0) throw new ProductoNoEncontrado(id);

  }
  persist() {
    if (this.id === null) return Producto.#insert(this);
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
