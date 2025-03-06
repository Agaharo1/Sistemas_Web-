import { body } from "express-validator";
import { Producto } from "./Productos.js";

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
    const result = Producto.crearProducto(nombre, descripcion, precio,user_id);
    res.redirect("/productos/productoExitoso");
  } catch (e) {
    res.status(400).send(e.message);
  }
}

