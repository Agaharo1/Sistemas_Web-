import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";
import { DirEnvio } from "./direccionEnt.js";
import { Tarjeta } from "./tarjeta.js";
import { compra } from "./compra.js";
import { body, validationResult, matchedData, ExpressValidator } from 'express-validator';



export function mostrarHisVentas(req, res) {

 const usuario_id = req.session.user_id;
 const productos = Producto.getSoldProductByUserId(usuario_id);

 return res.render("pagina", {
   contenido: "paginas/envios/resumenVentas",
   session: req.session,
   productos,
   helpers: {
     error: (errores, campo) => errores[campo]?.msg || "",
   },
 });
}


export function mostarHistorial(req, res) {
  const usuario_id = req.session.user_id;
  const historial = compra.getComprasByUsuarioId(usuario_id);
  const nombresProductos = historial.map(compra => {
    return Producto.getProductNameById(compra.producto_id);
  });
  return res.render("pagina", {
    contenido: "paginas/envios/resumenCompras",
    historial, 
    nombresProductos, 
    session: req.session,
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  });
}
export async function mostrarTicket(req, res) {
  const { id } = req.params;
  const comp = await compra.getCompraById(id); 
  const producto = await Producto.getProductById(comp.producto_id);
  const mensaje = res.locals.getAndClearFlash();
  return res.render("pagina", {
    contenido: "paginas/envios/confirmacionCompra",
    session: req.session,
    direccionSeleccionada: comp.direccion_entrega,
    compra: {
      numero_tarjeta: comp.numero_tarjeta,
      nombre_titular: comp.nombre_titular,
    },
    total: comp.precio,
    producto,
    mensaje, 
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  });
}



export async function confirmacionCompra(req, res) {
  const { id } = req.params;
  const { direccionSeleccionada, tarjetaSeleccionada, costoEntrega, total } = req.body;
  if (!direccionSeleccionada || !tarjetaSeleccionada) {
    return res.redirect(`/envios/resumenProducto/${id}`);
  }
  const usuario_id = req.session.user_id;
  const producto = await Producto.getProductById(id);
  if(producto.vendido) {
    return res.redirect(`/`); //Esto deberia envia a mis pedidos o algo asi
  }
  const id_targeta = Tarjeta.getIdTargetaById(usuario_id);

  const tarjeta = Tarjeta.getTarjetaById(id_targeta);
  const produ = producto;
  const dni = DirEnvio.getDniByUsuarioId(usuario_id);
  const telefono = DirEnvio.getTelefonoByUsuarioId(usuario_id);
  const direccionEntrega = direccionSeleccionada || "Dirección no especificada";
  Producto.venderProducto(id); // Para marcar el producto como vendido en la base de datos
  const compraId = await compra.crearCompra(produ.id, total, direccionEntrega, dni, telefono, tarjeta.nombre, usuario_id, id_targeta, tarjeta.numero_tarjeta, tarjeta.nombre_titular);
  res.setFlash('Compra realizada con éxito.');

  return res.redirect(`/envios/confirmacionCompra/${compraId}`);
}


export async function eliminarTarjeta(req, res) {
    const { tarjeta_id, productoId, } = req.body;
    await Tarjeta.eliminarTarjetaById(tarjeta_id);
    res.setFlash('Tarjeta eliminada con éxito.');
    return res.redirect(`/envios/resumenProducto/${productoId}`);
}

export async function eliminarDireccion(req, res) {
  const { direccion_id, productoId } = req.body;
  try {
    await DirEnvio.eliminarDireccionById(direccion_id);
    res.setFlash('Dirección eliminada con éxito.');
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (error) {
    return res.status(500).send("Error al eliminar la dirección.");
  }
}

export function mostrarPuntoRecogida(req, res) {
  const { puntoId, productoId } = req.body;
  try {
    const puntoRecogida = PuntoRecogida.getPuntoRecogidaByOneId(puntoId);
    req.session.puntoRecogidaSeleccionado = puntoRecogida;
    res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (error) {
    res.status(404).send('Error al procesar el punto de recogida');
  }
}




export function formularioTarjeta(req, res) {
  const { id } = req.params;

  const params = {
    contenido: "paginas/envios/formTarjeta",
    session: req.session,
    id,
    datos: {},
    errores: {},
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  };
  res.render("pagina", params);

}


export function mostrarTarjetas(req, res) {
  const { id } = req.params;
  const usuario_id = req.session.user_id;
  const tarjetas = Tarjeta.getTarjetasByUsuarioId(usuario_id);
  return res.render("pagina", {
    contenido: "paginas/envios/deleteformTarjeta",
    session: req.session,
    id,
    tarjetas,
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  });
}


export function editarDireccion(req, res) {

  const { id } = req.params;
  const usuario_id = req.session.user_id;
  const direcciones = DirEnvio.getDireccionesByUsuarioId(usuario_id);
  return res.render("pagina", {
    contenido: "paginas/envios/editarDireccion",
    session: req.session,
    id,
    direcciones,
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  });
}

export function formularioPuntoRecogida(req, res) {
  const { id } = req.params;
  const puntoRecogida = PuntoRecogida.getPuntoRecogidaById(id);
  const params = {
    contenido: "paginas/envios/formPuntoRecogida",
    session: req.session,
    id,
    puntoRecogida,
    datos: {},
    errores: {},
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },

  };
  res.render("pagina", params);

}


export async function formularioEditarDireccion(req,res) {
  const direccionId = req.params.id;
  const id = req.query.productoId;
  const direccion = await DirEnvio.getDireccionById(direccionId);
  const params = {
    contenido: "paginas/envios/formEditarDireccion",
    session: req.session,
    direccion,
    id,
    datos: {},
    errores: {},
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },

  };
  res.render("pagina", params);
}


export function formularioEnvioProducto(req, res) {
  const { id } = req.params;
  const params = {
    contenido: "paginas/envios/formEnvioProducto",
    session: req.session,
    id,
    datos: {},
    errores: {},
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  };
  res.render("pagina", params);

}


export async function envioProducto(req, res) {
  const { id } = req.params;
  const producto = await Producto.getProductById(id);
  const usuario = await Usuario.getUsuarioById(producto.id_user);
  const imagen = await Imagen.getImagenByProductId(id);
  const mensaje = res.locals.getAndClearFlash();
  const puntoRecogida = req.session.puntoRecogidaSeleccionado;

  const direcciones = DirEnvio.getDireccionesByUsuarioId(req.session.user_id);
  const tarjetas = Tarjeta.getTarjetasByUsuarioId(req.session.user_id);

  const params = {
    contenido: "paginas/envios/resumenProducto",
    session: req.session,
    producto,
    usuario,
    mensaje,
    imagen,
    puntoRecogida,
    direcciones,
    tarjetas
  };
  res.render("pagina", params);
}



export async function crearPuntoRecogida(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const { id } = req.params;
    const puntoRecogida = PuntoRecogida.getPuntoRecogidaById(id)
    const errores = result.mapped();
    const datos = matchedData(req);
    return res.render("pagina", {
      contenido: "paginas/envios/formPuntoRecogida",
      session: req.session,
      id,
      datos,
      puntoRecogida,
      errores,
      helpers: {
        error: (errores, campo) => errores[campo]?.msg || "",
      },
    });
  }
  const { nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida, productoId } = req.body;
  try {
    const usuario_id = req.session.user_id;
    await DirEnvio.crearDireccion(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida);
    res.setFlash('Punto de recogida añadido con éxito.');
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (e) {
    return res.status(500).send("Error al crear la dirección.");
  }
}


export async function crearDireccion(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const { id } = req.params;
    const errores = result.mapped();
    const datos = matchedData(req);
    return res.render("pagina", {
      contenido: "paginas/envios/formEnvioProducto",
      session: req.session,
      id,
      datos,
      errores,
      helpers: {
        error: (errores, campo) => errores[campo]?.msg || "",
      },
    });
  }
  const { nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida, productoId } = req.body;
  try {
    const usuario_id = req.session.user_id;

    await DirEnvio.crearDireccion(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida);
    res.setFlash('Direccion añadida con éxito.');
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (e) {
    return res.status(500).send("Error al crear la dirección.");
  }
}


export async function crearTarjeta(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errores = result.mapped();
    const datos = matchedData(req);
    const { id } = req.params;
    return res.render("pagina", {
      contenido: "paginas/envios/formTarjeta",
      session: req.session,
      id,
      datos,
      errores,
      helpers: {
        error: (errores, campo) => errores[campo]?.msg || "",
      },
    });
  }
  const { numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular } = req.body;
  try {
    const usuario_id = req.session.user_id;
    await Tarjeta.crearTarjeta(usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular);
    res.setFlash('Tarjeta añadida con éxito.');
    return res.redirect(`/envios/resumenProducto/${req.params.id}`);
  } catch (e) {
    return res.status(500).send("Error al crear la dirección.");
  }
}

export async function updateDireccion(req, res) {
    const result = validationResult(req);
    const { direccionId, nombre, codigo_postal, telefono, dni, direccion_entrega, productoId } = req.body;

    if (!result.isEmpty()) {
        const direccion = await DirEnvio.getDireccionById(direccionId);
        return res.render("pagina", {
            contenido: "paginas/envios/formEditarDireccion",
            session: req.session,
            direccion,
            id: productoId,
            datos: req.body,
            errores: result.mapped(),
            helpers: {
                error: (errores, campo) => errores[campo]?.msg || "",
            },
        });
    }

    await DirEnvio.updateDireccion({
        id: direccionId,
        nombre,
        codigo_postal,
        telefono,
        dni,
        direccion_entrega
    });
     res.setFlash('Direccion modificada con éxito.');

    res.redirect(`/envios/resumenProducto/${productoId}`);
}