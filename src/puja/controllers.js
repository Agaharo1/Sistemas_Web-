import { config } from "../config.js";
import { Puja } from "../puja/Puja.js";
import { Imagen } from "../imagenes/Imagen.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import { logger } from "../logger.js";

// Crear una nueva puja si no existe una para el producto
export function nuevaPuja(req, res) {
  const { id_producto } = req.params;
  const id_user_sesion = req.session.user_id;
  const valor_max = parseFloat(req.body.valor_max);

  if (isNaN(valor_max) || valor_max <= 0) {
    return res.status(400).send("Debe introducir un precio de salida válido");
  }

  const producto = Producto.getProductById(id_producto);
  if (!producto || producto.id_user !== id_user_sesion) {
    return res.status(403).send("No autorizado para crear una puja en este producto.");
  }

  const pujasExistentes = Puja.getPujaByProductId(id_producto);
  if (pujasExistentes.length > 0) {
    return res.redirect(`/pujas/puja/${pujasExistentes[0].id}`);
  }

  const nuevaPuja = Puja.crearPuja(id_user_sesion, id_producto, valor_max);

  if (nuevaPuja && nuevaPuja.id) {
    return res.redirect(`/pujas/misPujas`);
  }

  res.status(500).send("Error al crear la puja");
}

export function viewMisSubastas(req, res) {
  const id_user = req.session.user_id;
  const ahora = Date.now();

  const propias = Puja.getPujaByUser(id_user)

  const enriched = propias.map(puja => {
    const producto = Producto.getProductById(puja.producto);
    const imagen = Imagen.getImagenByProductId(puja.producto);
    const tiempoRestante = Math.max(0, puja.fecha_limite - ahora);

    return {
      ...puja,
      productName: producto.nombre,
      productId: producto.id,
      imagen: imagen,
      tiempoRestante: Math.floor(tiempoRestante / 1000),
    };
  });

  res.render("pagina", {
    contenido: "paginas/pujas/misSubastas",
    session: req.session,
    subastas: enriched,
  });
}

// Vista de una puja concreta
export function viewPuja(req, res) {
  const { id } = req.params;

  if (!id) return res.status(400).send("ID de puja no válido");

  let puja;
  try {
    puja = Puja.getPujaById(id);
  } catch (error) {
    return res.status(404).send(error.message);
  }

  puja.fecha_limite = new Date(puja.fecha_limite).getTime();

  const usuario = Usuario.getUsuarioById(puja.id_u);
  const producto = Producto.getProductById(puja.producto);
  const imagenes = Imagen.getImagenByProductId(puja.producto);
  const pujadas = Puja.getPujadasByPujaId(id) || [];
  const ahora = Date.now();
  const tiempoRestante = Math.max(0, Math.floor((puja.fecha_limite - ahora) / 1000));

  if (!usuario || !producto || !imagenes) {
    return res.status(500).send("Error al recuperar datos relacionados");
  }

  const params = {
    contenido: "paginas/pujas/puja",
    session: req.session,
    puja,
    usuario: usuario.nombre,
    productName: producto.nombre,
    productId: producto.id,
    imagenes,
    ahora,
    tiempoRestante,
    pujadas
  };

  res.render("pagina", params);
}

// Vista de todas las pujas del usuario actual
export function viewMisPujas(req, res) {
  const id_u = req.session.user_id;
  let pujas = Puja.getPujaByUser(id_u) || [];
  const ahora = Date.now();

  pujas = pujas.map(puja => {
    const producto = Producto.getProductById(puja.producto);
    const imagen = Imagen.getImagenByProductId(puja.producto);
    const usuario = Usuario.getUsuarioById(puja.id_u);

    const tiempoRestante = puja.fecha_limite - ahora;
    const ganada = (tiempoRestante <= 0 && puja.id_u === id_u);
    return {
      ...puja,
      productName: producto?.nombre || "Sin nombre",
      productId: producto?.id || puja.producto,
      imagen: imagen || "default.jpg",
      nombreUsuario: usuario?.nombre || "Anónimo",
      ganada
    };
  });

  res.render("pagina", {
    contenido: "paginas/pujas/misPujas",
    session: req.session,
    pujas
  });
}

// Procesar una puja nueva (pujar sobre una existente)
export function pujar(req, res) {
  const { id_puja } = req.params;
  const { valor, id_u } = req.body;

  const puja = Puja.getPujaById(id_puja);

  const ahora = Date.now();
  if (puja.fecha_limite <= ahora) {
    console.log("La puja ha expirado.");
    return res.status(403).send("La puja ha expirado.");
  }

  if (puja.valor_max >= valor) {
    console.log("No se puede realizar la puja");
    return res.redirect(`/pujas/puja/${id_puja}`);
  }

  Puja.pujar(id_puja, valor, id_u);
  res.redirect("/pujas/misPujas");
}


// Eliminar una puja
export function eliminarPuja(req, res) {
  const { id } = req.params;

  try {
    Puja.eliminarPuja(parseInt(id));
    res.redirect("/pujas/misPujas");
  } catch (e) {
    res.status(400).send(e.message);
  }
}
