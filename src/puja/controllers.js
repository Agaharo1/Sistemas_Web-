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

  const pujasExistentes = Puja.getPujaByUser(id_user_sesion) || [];

  const pujaExistente = pujasExistentes.find(p => p.producto == id_producto);
  if (pujaExistente) {
    return res.redirect(`/pujas/puja/${pujaExistente.id}`);
  }

  const nuevaPuja = Puja.crearPuja(id_user_sesion, id_producto);

  if (nuevaPuja && nuevaPuja.id) {
    logger.info(`Redirigiendo a: /pujas/puja/${nuevaPuja.id}`);
    return res.redirect(`/pujas/puja/${nuevaPuja.id}`);
  }

  res.status(500).send("Error al crear la puja");
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

  const usuario = Usuario.getUsuarioById(puja.id_u);
  const producto = Producto.getProductById(puja.producto);
  const imagenes = Imagen.getImagenByProductId(puja.producto);
  const pujadas = Puja.getPujadasByPujaId(id) || [];

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
    pujadas
  };

  res.render("pagina", params);
}

// Vista de todas las pujas del usuario actual
export function viewMisPujas(req, res) {
  const id_u = req.session.user_id;
  let pujas = Puja.getPujaByUser(id_u) || [];

  pujas = pujas.map(puja => {
    const producto = Producto.getProductById(puja.producto);
    const imagen = Imagen.getImagenByProductId(puja.producto);
    const usuario = Usuario.getUsuarioById(puja.id_u);
    return {
      ...puja,
      productName: producto?.nombre || "Sin nombre",
      productId: producto?.id || puja.producto,
      imagen: imagen || "default.jpg", // sin .nombre ni [0]
      nombreUsuario: usuario?.nombre || "Anónimo"
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

  if (!valor || !id_u || !id_puja) {
    return res.status(400).send("Faltan datos para pujar");
  }

  const puja = Puja.getPujaById(id_puja);
  if (!puja) {
    return res.status(404).send("Puja no encontrada");
  }

  const valorFloat = parseFloat(valor);
  if (isNaN(valorFloat)) {
    return res.status(400).send("Valor inválido");
  }

  if (valorFloat <= puja.valor_max) {
    console.log("No se puede realizar la puja, debe ser mayor al valor actual");
    return res.redirect(`/pujas/puja/${id_puja}`);
  }

  Puja.pujar(id_puja, valorFloat, id_u);
  return res.redirect(`/pujas/misPujas`);
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
