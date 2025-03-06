
import { Producto } from "./Productos.js";
import { config } from "../config.js";
import { Imagen } from "../imagenes/Imagen.js";

import fs from 'fs';
import path from 'path';





export function viewSubirProducto(req, res) {
  const params = {
    contenido: "paginas/productos/subirProducto",
    session: req.session,
  };
  res.render("pagina", params);
}


export function viewProductoExitoso(req, res) {
  const params = {
    contenido: "paginas/productos/productoExitoso",
    session: req.session,
  };
  res.render("pagina", params);
}


export function doSubirProducto(req, res) {
  const { nombre, descripcion, precio ,user_id} = req.body;
  try {
    console.log("Subiendo producto:", nombre, descripcion, precio,user_id);
    const result = Producto.crearProducto(nombre, descripcion, precio,user_id,req.file.filename,config.uploads);
    const productoId = result.id;
    
    res.redirect("/productos/productoExitoso");
  } catch (e) {
    res.status(400).send(e.message);
  }
}
export function eliminarProducto(req, res) {
  const { id } = req.params;
  try {
    console.log("Eliminando producto:", id);
    Producto.eliminarProducto(id);
    res.redirect("/contenido/misProductos");
  } catch (e) {
    res.status(400).send(e.message);
  }
}
export function editarProducto(req, res) {
  const { id } = req.params;
  const producto = Producto.obtenerProducto(id);
  const params = {
    contenido: "paginas/productos/editarProducto",
    session: req.session,
    producto,
  };
  res.render("pagina", params);
}
export function doEditarProducto(req, res) {
  const { id, nombre, descripcion, precio } = req.body;
  try {
    console.log("Editando producto:", id, nombre, descripcion, precio);
    Producto.editarProducto(id, nombre, descripcion, precio);
    res.redirect("/contenido/misProductos");
  } catch (e) {
    res.status(400).send(e.message);
  }
}