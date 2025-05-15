import { config } from "../config.js";
import { Puja } from "../puja/Puja.js";
import { Imagen } from "../imagenes/Imagen.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Producto } from "../productos/Productos.js";
import { logger } from "../logger.js";

// Crear una nueva puja si no existe una para el producto
export async function nuevaPuja(req, res) {
  const { id_producto } = req.params;
  const id_user_sesion = req.session.user_id;
  const precio_salida = req.body.precio_salida;

  if (isNaN(precio_salida) || precio_salida <= 0) {
    return res.status(400).send("Debe introducir un precio de salida válido");
  }

  const producto =  Producto.getProductById(id_producto);
  if (!producto || producto.id_user !== id_user_sesion) {
    return res.status(403).send("No autorizado para crear una puja en este producto.");
  }

  const nuevaPuja = Puja.crearPuja(id_user_sesion, id_producto, precio_salida);

  if (nuevaPuja && nuevaPuja.id) {
    return res.redirect(`/pujas/misSubastas`);
  }

  res.status(500).send("Error al crear la puja");
}

// Mostrar las subastas creadas por el usuario
export async function viewMisSubastas(req, res) {
  const id_user = req.session.user_id;
  const ahora = Date.now();

  const propias = Puja.getPujaByPropietario(id_user) || [];

  const enriched = propias.map( puja => {
    const producto =  Producto.getProductById(puja.producto);
    const imagen = Imagen.getImagenByProductId(puja.producto);
    const tiempoRestante = Math.max(0, puja.fecha_limite - ahora);
    const sinPujas = (tiempoRestante <= 0 && puja.valor_max === puja.precio_salida);
    const ganador = puja.id_u ?  Usuario.getUsuarioById(puja.id_u) : null;

    return {
      ...puja,
      productName: producto.nombre,
      productId: producto.id,
      imagen: imagen,
      tiempoRestante: Math.floor(tiempoRestante / 1000),
      sinPujas,
      nombreGanador: ganador ? ganador.nombre : null
    };
  });

  res.render("pagina", {
    contenido: "paginas/pujas/misSubastas",
    session: req.session,
    subastas: enriched,
  });
}

// Vista de una puja concreta
export async function viewPuja(req, res) {
  const { id } = req.params;

  let puja;
  try {
    puja = Puja.getPujaById(id);
  } catch (error) {
    return res.status(404).send(error.message);
  }

  const ahora = Date.now();
  const tiempoRestante = Math.max(0, Math.floor((puja.fecha_limite - ahora) / 1000));

  const producto =  Producto.getProductById(puja.producto);
  const imagenes = Imagen.getImagenByProductId(puja.producto);
  const vendedor =  Usuario.getUsuarioById(producto.id_user);
  const pujadas = Puja.getPujadasByPujaId(id);
  const pujadasConNombre =  pujadas.map( p => {
    const usuario =  Usuario.getUsuarioById(p.id_u);
    return {
      ...p,
      nombreUsuario: usuario ? usuario.nombre : `Usuario ${p.id_u}`
    };
  });

  const params = {
    contenido: "paginas/pujas/puja",
    session: req.session,
    puja,
    productName: producto.nombre,
    productId: producto.id,
    imagenes,
    vendedorNombre: vendedor.nombre,
    pujadas: pujadasConNombre,
    query: req.query,
    tiempoRestante
  };

  res.render("pagina", params);
}

// Vista de todas las pujas del usuario actual
export async function viewMisPujas(req, res) {
  const id_u = req.session.user_id;
  let pujas = Puja.getPujaByUser(id_u) || [];
  const ahora = Date.now();

  pujas =  pujas.map( puja => {
    const producto =  Producto.getProductById(puja.producto);
    const imagen = Imagen.getImagenByProductId(puja.producto);
    const usuario =  Usuario.getUsuarioById(puja.id_u);
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

export async function eliminarPujaPropietario(req, res) {
  const { id } = req.params;
  const userId = req.session.user_id;

  try {
    const puja = Puja.getPujaById(id);
    const producto =  Producto.getProductById(puja.producto);

    if (producto.id_user !== userId) {
      return res.status(403).send("No tienes permiso para eliminar esta puja.");
    }

    Puja.eliminarPuja(id);
    res.redirect("/pujas/misSubastas");
  } catch (e) {
    res.status(400).send("Error al eliminar la puja: " + e.message);
  }
}

// Procesar una puja nueva (pujar sobre una existente)
export function pujar(req, res) {
  const { id_puja } = req.params;
  const { valor, id_u } = req.body;

  const puja = Puja.getPujaById(id_puja);

  const ahora = Date.now();
  if (puja.fecha_limite <= ahora) {
    return res.status(403).send("La puja ha expirado.");
  }

  if (valor <= puja.valor_max) {
    return res.redirect(`/pujas/puja/${id_puja}?error=La puja debe ser mayor que la actual`);
  }

  Puja.pujar(id_puja, valor, id_u);
  return res.redirect(`/pujas/puja/${id_puja}`);
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
