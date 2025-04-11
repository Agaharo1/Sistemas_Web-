import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";
import { DirEnvio } from "./direccionEnt.js";
import { Tarjeta } from "./tarjeta.js";
import { body, validationResult, matchedData } from 'express-validator';

export function agradecimiento(req, res) {

    const params = {
        contenido: "paginas/envios/agradecimiento",
        session: req.session,
    };
    res.render("pagina", params);

}
export function confirmacionCompra(req, res) {
  const { direccionSeleccionada, tarjetaSeleccionada, costoEntrega, total } = req.body;
  const { id } = req.params;

  const producto = Producto.getProductById(id);

  console.log('Datos recibidos:', {
      direccionSeleccionada,
      tarjetaSeleccionada: JSON.parse(tarjetaSeleccionada), 
      costoEntrega,
      total,
      producto,
  });

  res.render('paginas/envios/confirmacionCompra', {
      direccionSeleccionada,
      tarjetaSeleccionada: JSON.parse(tarjetaSeleccionada),
      costoEntrega,
      total,
      producto,
  });
}


export async function crearTarjeta(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
      const errores = result.mapped();
      const datos = matchedData(req);
      const { id } = req.params;
      const producto = Producto.getProductById(id);
      return res.render("pagina", {
          contenido: "paginas/envios/formTarjeta",
          session: req.session,
          producto,
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
      const { id } = req.params;
      const producto = Producto.getProductById(id);
      return res.render("pagina", {
          contenido: "paginas/envios/formTarjeta",
          session: req.session,
          producto,
          error: "No se ha podido guardar la tarjeta",
          datos: {}, 
          errores: {}, 
          helpers: {
              error: (errores, campo) => errores[campo]?.msg || "",
          },
      });
  }
}
export function formularioTarjeta(req, res) {
    const { id } = req.params;
    console.log("ID del producto recibido:", id);
    const producto = Producto.getProductById(id);
    console.log(producto);
    const params = {
      contenido: "paginas/envios/formTarjeta",
      session: req.session,
      producto,
      datos: {}, 
      errores: {},
      helpers: {
        error: (errores, campo) => errores[campo]?.msg || "",
    },
    };
    res.render("pagina", params);
  
  }
export function formularioPuntoRecogida(req, res) {
    const { id } = req.params;
    console.log("ID del producto recibido:", id);
    const producto = Producto.getProductById(id);
    console.log(producto);
    const puntoRecogida = PuntoRecogida.getPuntoRecogidaById(id);
    const params = {
      contenido: "paginas/envios/formPuntoRecogida",
      session: req.session,
      producto,
      puntoRecogida,
      datos: {},
      errores: {},
      helpers: {
        error: (errores, campo) => errores[campo]?.msg || "",
      },
      
    };
    res.render("pagina", params);
  
  }

  export function mostrarPuntoRecogida(req, res) {
    const { puntoId,productoId } = req.body;
    console.log("Producto ID recibido:", productoId);
    try {
        const puntoRecogida = PuntoRecogida.getPuntoRecogidaByOneId(puntoId);
        req.session.puntoRecogidaSeleccionado = puntoRecogida;
        res.redirect(`/envios/resumenProducto/${productoId}`);
    } catch (error) {
        res.status(404).send('Error al procesar el punto de recogida');
    }
} 

  export function formularioEnvioProducto(req, res) {
    const { id } = req.params;
    console.log("ID del producto recibido:", id);
    const producto = Producto.getProductById(id);
    console.log(producto);

    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }
    const params = {
      contenido: "paginas/envios/formEnvioProducto",
      session: req.session,
      producto,
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
    console.log("Punto de recogida seleccionado:", puntoRecogida);

    const direcciones = DirEnvio.getDireccionesByUsuarioId(req.session.user_id);
    const tarjetas =  Tarjeta.getTarjetasByUsuarioId(req.session.user_id); 
  
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
        const producto = Producto.getProductById(id);
        return res.render("pagina", {
            contenido: "paginas/envios/formPuntoRecogida",
            session: req.session,
            producto,
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
      const producto = Producto.getProductById(id);
      return res.render("pagina", {
          contenido: "paginas/envios/formEnvioProducto",
          session: req.session,
          producto,
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

