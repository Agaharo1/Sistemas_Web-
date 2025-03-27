
import { Producto } from "./Productos.js";
import { config } from "../config.js";
import { Imagen } from "../imagenes/Imagen.js";
import { body } from "express-validator";
import { Usuario } from "../usuarios/Usuario.js";
import { ProductoNoEncontrado } from "./Productos.js";

import fs from 'fs';
import path from 'path';




export function mostrarProducto(req, res) {
  const { id } = req.params;
  const producto = Producto.getProductById(id);
  const usuario = Usuario.getUsuarioById(producto.id_user);
  const imagen = Imagen.getImagenByProductId(id);
  const params = {
    contenido: "paginas/productos/mostrarProducto",
    session: req.session,
    producto,
    usuario,
    imagen
  };
  res.render("pagina", params);
}
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
  let producto = Producto.getProductById(id);
  if( req.session.user_id != producto.id_user){
    res.status(400).send("No puedes eliminar un producto que no es tuyo");
    return;
  }
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
  let producto = Producto.getProductById(id);
  if( req.session.user_id != producto.id_user){     
    res.status(400).send("No puedes eliminar un producto que no es tuyo");
    return;
  }
  const params = {
    contenido: "paginas/productos/editarProducto",
    session: req.session,
    producto,
    id
  };
  res.render("pagina", params);
}
export function doEditarProducto(req, res) {
  const { id, nombre, descripcion, precio } = req.body;
  try {
    console.log("Editando producto:", id, nombre, descripcion, precio);
    Producto.editarProducto(nombre, descripcion, precio, id);
    res.redirect("/contenido/misProductos");
  } catch (e) {
    res.status(400).send(e.message);
  }
}