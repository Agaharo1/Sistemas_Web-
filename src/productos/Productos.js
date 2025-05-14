import { Imagen } from "../imagenes/Imagen.js";
import {Chat} from "../chat/Chat.js";
import { Puja } from "../puja/Puja.js";
import fs from 'fs';
import path from 'path';

export class Producto {
  static #getByUserIdStmt = null;
  static #getAllStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;
  static #deleteStmt = null;
  static #getByIdStmt = null;
  static #venderStmt = null;
  static #getNombreByIdStmt = null;
  static #getSoldProductsByUserIdStmt = null;
  static #getNumberOfProducts=null;
  static #getNumberOfProductsByUser=null;
  static #getProductsByName=null;
  static #getProductPagina=null;
  static #getProductPaginaUserId=null;

  

  nombre;
  descripcion;
  precio;
  id;
  id_u;
  vendido;

  constructor(nombre, descripcion, precio, id_u,id = null,vendido = 0) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.id = id;
    this.id_u = id_u;
    this.vendido = vendido;
  }

  static initStatements(db) {
    if (this.#getByUserIdStmt !== null) return;
    this.#getByUserIdStmt = db.prepare(
      `SELECT p.vendido, p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
      FROM productos p 
      JOIN usuarios u ON p.id_user = u.id 
      JOIN Imagenes i ON i.id_producto = p.id WHERE id_user = @id_u`
    );

    this.#getSoldProductsByUserIdStmt = db.prepare(
      `SELECT  p.vendido, p.id, p.nombre, p.descripcion, p.precio, p.id_user, u.username AS username, u.nombre AS usuario_nombre, i.nombre AS imagen 
      FROM productos p 
      JOIN usuarios u ON p.id_user = u.id 
      JOIN Imagenes i ON i.id_producto = p.id 
      WHERE p.id_user = @id_u AND p.vendido = 1`
    );
    
    this.#insertStmt = db.prepare(
      "INSERT INTO productos(nombre,id_user, descripcion, precio) VALUES (@nombre,@id_u, @descripcion, @precio)"
    );
    this.#updateStmt = db.prepare(
      "UPDATE productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio, vendido = @vendido WHERE id = @id"
    );
    this.#getAllStmt = db.prepare(`SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id 
    `);
    this.#deleteStmt = db.prepare("DELETE FROM productos WHERE id = @id");
    this.#getByIdStmt = db.prepare(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,p.vendido as vendido,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id 
    WHERE p.id = @id`
    );
    this.#venderStmt = db.prepare(
      "UPDATE productos SET vendido = 1 WHERE id = @id"
    );
    this.#getNombreByIdStmt = db.prepare(`
      SELECT nombre FROM productos WHERE id = @id
  `);
    this.#getNumberOfProducts = db.prepare(`
      SELECT COUNT(*) as total FROM productos
    `);  
    this.#getNumberOfProductsByUser = db.prepare(`
      SELECT COUNT(*) as total FROM productos WHERE id_user = @id_u
    `);
    this.#getProductPagina = db.prepare(`SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id
    LIMIT @limit OFFSET @offset
    `);
    this.#getProductPaginaUserId=db.prepare(`SELECT p.id, p.nombre, p.descripcion, p.precio, p.id_user,u.username as username, u.nombre AS usuario_nombre, i.nombre as imagen 
    FROM productos p 
    JOIN usuarios u ON p.id_user = u.id 
    JOIN Imagenes i ON i.id_producto = p.id
    WHERE p.id_user = @id_u
    LIMIT @limit OFFSET @offset
    `);
    
}
static async getPaginaProductos(pagina) {
  const offset = (pagina - 1) * 3;
  const limit = 3;
  const productosPagina = this.#getProductPagina.all({ limit, offset });
  return productosPagina;
}

static async getPaginaProductosUser(pagina, id_u) {
  const offset = (pagina - 1) * 3;
  const limit = 3;
  const productosPagina = this.#getProductPaginaUserId.all({ id_u, limit, offset });
  return productosPagina;
}

static async getNumberOfProducts() {
    const result = this.#getNumberOfProducts.get();
    return result.total;
}

static async getNumberOfProductsUser(id_u) {
  const result = this.#getNumberOfProductsByUser.get({ id_u });
  return result.total;
}

static getSoldProductByUserId(id_u) {
 
  return  this.#getSoldProductsByUserIdStmt.all({ id_u });
}

static getProductNameById(id) {
  return this.#getNombreByIdStmt.get({ id });
}
  
  static venderProducto(id) {
    const result = Producto.#venderStmt.run({ id });
    if (result.changes === 0) throw new ProductoNoEncontrado(id);
    return result;
  }

  static editarProducto(nombre, descripcion, precio, id) {
    
    const result =new Producto(nombre, descripcion, precio, null, id).persist();
    if(result.changes === 0) throw new ProductoNoEncontrado(id);
    return result;
  }

  static async getProductById(id) {
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
    const vendido = producto.vendido;
    const datos = { nombre, descripcion, precio,id,vendido: vendido };

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
    Chat.eliminarChatByProduct(parseInt(id));
    Puja.eliminarPujaByProduct(id)
    Imagen.eliminarImagen(id);
    const result = this.#deleteStmt.run({ id });
    if (result.changes === 0) throw new ProductoNoEncontrado(id);

  }
  persist() {
    if (this.id === null) return Producto.#insert(this);
    return Producto.#update(this);
  }

  static buscarProducto(nombre) {
    const productos = this.#getAllStmt.all();
    const productosFiltrados = productos.filter((p) => p.nombre.toLowerCase().includes(nombre.toLowerCase()));
    if (productosFiltrados.length === 0) throw new ProductoNoEncontrado(nombre);
    return productosFiltrados;
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

