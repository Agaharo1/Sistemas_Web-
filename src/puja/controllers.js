import { config } from "../config.js";
import { Puja } from "../puja/Puja.js";
import { Imagen } from "../imagenes/Imagen.js";
import { body } from "express-validator";
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import session from "express-session";
import { logger } from "../logger.js";

export function nuevaPuja(req, res){
    const { id_producto} = req.params;
    const {id_user_sesion } = req.query;

    //Comprobamos si ya existe una puja
    const pujaExistente = Puja.getPujaByUser(id_user_sesion);
    if (pujaExistente !== null) {
        //Si existe, redirigimos a la puja existente
        return res.redirect(`/pujas/puja/${pujaExistente.id}`);
    }
    const nuevaPuja = Puja.crearPuja(id_user_sesion, id_producto, null);

    if (nuevaPuja) {
      console.log("Redirigiendo a:", `/pujas/puja/${nuevaPuja.id}`);
      res.redirect(`/pujas/puja/${nuevaPuja.id}`);
    } else {
        res.status(500).send("Error al crear la puja");
  }

}

export function viewPuja(req, res) {
  const { id } = req.params;
  console.log('Aqui');
  const puja = Puja.getPujaById(id);
  console.log(puja);
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
  const id_u = req.session.user_id;
  let pujas = Puja.getPujaByUser(id_u) || [];

  // Enriquecer cada puja con producto, imagen y nombre
  pujas = pujas.map(puja => {
    const producto = Producto.getProductById(puja.producto);
    const imagenes = Imagen.getImagenByProductId(puja.producto);
    const usuario = Usuario.getUsuarioById(puja.id_u);

    return {
      ...puja,
      productName: producto?.nombre || 'Sin nombre',
      productId: producto?.id || puja.producto,
      imagen: imagenes?.[0]?.nombre || 'default.jpg',
      nombreUsuario: usuario?.nombre || 'Anónimo'
    };
  });

  const params = {
    contenido: "paginas/pujas/misPujas",
    session: req.session,
    pujas
  };

  res.render("pagina", params);
}

export function pujar(req, res) {
  const {id_puja} = req.params;
  const { valor, id_u } = req.body;

  let puja = Puja.getPujaById(id_puja);

  if (puja.valor_max >= valor){
    console.log("No se puede realizar la puja");
    res.redirect(`/pujas/puja/${id_puja}`);
  }

  const nuevaPujada = Puja.pujar(id_puja, valor, id_u);
  res.redirect(`/pujas/misPujas/${id_u}`);
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