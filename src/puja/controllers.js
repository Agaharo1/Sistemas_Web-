import { config } from "../config.js";
import { Puja } from "../puja/Puja.js";
import { Imagen } from "../imagenes/Imagen.js";
import { body } from "express-validator";
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";

export function nuevaPuja(req, res){
    const { id} = req.params;
    const { id_producto, id_user_sesion } = req.query;

    //Comprobamos si ya existe una puja
    const pujaExistente = Puja.getPujaByUser(id_producto, id_user_sesion);
    if (pujaExistente !== null) {
        //Si existe, redirigimos a la puja existente
        return res.redirect(`/puja/puja/${pujaExistente.id}`);
    }
    const nuevaPuja = Puja.crearPuja(id_producto, id, id_user_sesion);

    if (nuevaPuja) {
        res.redirect(`/pujas/puja/${nuevaPuja.id}`);
    } else {
        res.status(500).send("Error al crear la puja");
    }

}

export function viewPuja(req, res) {
  const { id } = req.params;
  const puja = Puja.getPujaById(id);
  if(!puja) {
    return res.status(404).send("Puja no encontrada");
  }
    const usuario = Usuario.getUsuarioById(puja.id_u);
    if(!usuario) {
        return res.status(404).send("Usuario no encontrado");
    }
    const producto = Producto.getProductById(puja.producto);
    if(!producto) {
        return res.status(404).send("Producto no encontrado");
    }
    const imagenes = Imagen.getImagenByProductId(puja.producto);
    if(!imagenes) {
        return res.status(404).send("Imagenes no encontradas");
    }

  const pujadas = Puja.getPujadasByPujaId(id);
    if(!pujadas) {
        return pujadas=[];
    }
  const params = {
    contenido: "paginas/pujas/puja",
    session: req.session,
    puja,
    usuario : usuario.nombre,
    productName : producto.nombre,
    productId : producto.id,
    imagenes,
    pujadas
  };
  res.render("pagina", params);
}

export function viewMisPujas(req, res) {
 
  const pujas = Puja.getPujaByUser(parseInt(req.session.user_id));
 
  const params = {
    contenido: "paginas/pujas/misPujas",
    session: req.session,
    pujas
    
  };
  res.render("pagina", params);
}

export function pujar(req, res) {
  const { valor, id_puja, id_u } = req.body;
  const nuevaPujada = Puja.pujar(id_puja, valor, id_u);
  res.redirect(`/pujas/puja/${id_puja}`);
}

export function eliminarPuja(req, res) {
  const { id } = req.params;
  try {
    console.log("Eliminando puja:", id);
    Puja.eliminarPuja(parseInt(id));
    res.redirect("/pujas/misPujas");
  } catch (e) {
    res.status(400).send(e.message);
  }
}