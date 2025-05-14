import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";
import { DirEnvio } from "./direccionEnt.js";
import { Tarjeta } from "./tarjeta.js";
import { compra } from "./compra.js";
import { body, validationResult, matchedData, ExpressValidator } from 'express-validator';



export function mostrarHisVentas(req, res) {
 console.log("mostrarHistorialVentas");
 const usuario_id = req.session.user_id;
 const productos = Producto.getSoldProductByUserId(usuario_id);

 console.log("Productos vendidos:", productos);

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
  console.log("mostarHistorial");
  const usuario_id = req.session.user_id;
  const historial = compra.getComprasByUsuarioId(usuario_id);
  const nombresProductos = historial.map(compra => {
    return Producto.getProductNameById(compra.producto_id);
  });

  console.log("Historial de compras:", historial);
  console.log("Nombres de productos:", nombresProductos);


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
  console.log("El id de la compra es: ", id)
  const comp = compra.getCompraById(id);
  const tarjeta = Tarjeta.getTarjetaById(comp.tarjeta_id);
  const producto = Producto.getProductById(comp.producto_id);
  return res.render("pagina", {
    contenido: "paginas/envios/confirmacionCompra",
    session: req.session,
    direccionSeleccionada: comp.direccion_entrega,
    tarjetaSeleccionada: {
      numero_tarjeta: tarjeta.numero_tarjeta,
      nombre_titular: tarjeta.nombre_titular,
    },
    total: comp.precio,
    producto,
    helpers: {
      error: (errores, campo) => errores[campo]?.msg || "",
    },
  });
}


export async function confirmacionCompra(req, res) {
  const { id } = req.params;
  const { direccionSeleccionada, tarjetaSeleccionada, costoEntrega, total } = req.body;
  console.log("tarjetaSeleccionada:", tarjetaSeleccionada);
  console.log("direccionSeleccionada:", direccionSeleccionada);
  if (!direccionSeleccionada || !tarjetaSeleccionada) {
    console.log("Faltan datos de dirección o tarjeta");
    return res.redirect(`/envios/resumenProducto/${id}`);
  }
  const usuario_id = req.session.user_id;
  const producto = Producto.getProductById(id);
  if(producto.vendido) {
    console.log("El producto ya ha sido vendido");
    return res.redirect(`/`); //Esto deberia envia a mis pedidos o algo asi
  }
  const id_targeta = Tarjeta.getIdTargetaById(usuario_id);
  const nombre = Tarjeta.getNombreById(usuario_id);

  const produ = producto;
  const dni = DirEnvio.getDniByUsuarioId(usuario_id);
  const telefono = DirEnvio.getTelefonoByUsuarioId(usuario_id);
  const direccionEntrega = direccionSeleccionada || "Dirección no especificada";
  Producto.venderProducto(id); // Para marcar el producto como vendido en la base de datos
  const compraId = await compra.crearCompra(produ.id, total, direccionEntrega, dni, telefono, nombre, usuario_id, id_targeta);
  console.log("Compra id = ", compraId)
  return res.redirect(`/envios/confirmacionCompra/${compraId}`);


}
export async function eliminarTarjeta(req, res) {
    const { tarjeta_id, productoId, } = req.body;
    await Tarjeta.eliminarTarjetaById(tarjeta_id);
    return res.redirect(`/envios/resumenProducto/${productoId}`);
}

export async function eliminarDireccion(req, res) {
  const { direccion_id, productoId } = req.body;
  console.log("ID de la dirección a eliminar:", direccion_id);
  try {
    await DirEnvio.eliminarDireccionById(direccion_id);
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (error) {
    console.error("Error al eliminar la dirección:", error);
    return res.status(500).send("Error al eliminar la dirección.");
  }
}


export function mostrarPuntoRecogida(req, res) {
  const { puntoId, productoId } = req.body;
  console.log("Producto ID recibido:", productoId);
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
  console.log("Tarjetas:", tarjetas);

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
  console.log("Direcciones:", direcciones);

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
  console.log("ID del producto recibido:", id);

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


export function envioProducto(req, res) {
  const { id } = req.params;
  const producto = Producto.getProductById(id);
  const usuario = Usuario.getUsuarioById(producto.id_user);
  const imagen = Imagen.getImagenByProductId(id);

  const puntoRecogida = req.session.puntoRecogidaSeleccionado;

  const direcciones = DirEnvio.getDireccionesByUsuarioId(req.session.user_id);
  const tarjetas = Tarjeta.getTarjetasByUsuarioId(req.session.user_id);

  const params = {
    contenido: "paginas/envios/resumenProducto",
    session: req.session,
    producto,
    usuario,
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
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (e) {
    console.error("Error al crear la dirección:", e.message);
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
    return res.redirect(`/envios/resumenProducto/${productoId}`);
  } catch (e) {
    console.error("Error al crear la dirección:", e.message);
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
    return res.redirect(`/envios/resumenProducto/${req.params.id}`);
  } catch (e) {
    console.error("Error al crear la tarjeta:", e.message);
    return res.status(500).send("Error al crear la dirección.");
  }
}
