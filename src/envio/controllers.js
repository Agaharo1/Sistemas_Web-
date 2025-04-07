import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";
import { DirEnvio } from "./direccionEnt.js";
import { Tarjeta } from "./tarjeta.js";

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


export function crearTarjeta(req, res) {
    const { numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular } = req.body;
    console.log("Datos recibidos:", {
        numero_tarjeta,
        fecha_expiracion,
        codigo_seguridad,
        nombre_titular
    });
    
        const usuario_id = req.session.user_id;
        console.log("Creando tarjeta:", {
            usuario_id,
            numero_tarjeta,
            fecha_expiracion,
            codigo_seguridad,
            nombre_titular
        });

      Tarjeta.crearTarjeta(usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular);
        return res.redirect(`/envios/resumenProducto/${req.params.id}`);
    
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
      puntoRecogida
      
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



  export async function crearDireccion(req, res) {
    const { nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida, productoId } = req.body;
console.log("Datos recibidos:", {
        nombre,
        codigo_postal,
        telefono,
        dni,
        direccion_entrega,
        punto_recogida,
        productoId
    });
    try {
        const usuario_id = req.session.user_id;
        console.log("Creando dirección:", {
            usuario_id,
            nombre,
            codigo_postal,
            telefono,
            dni,
            direccion_entrega,
            punto_recogida,
            productoId
        });

        await DirEnvio.crearDireccion(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida);
        return res.redirect(`/envios/resumenProducto/${productoId}`);
    } catch (e) {
        console.error("Error al crear la dirección:", e.message);
        return res.status(500).send("Error al crear la dirección.");
    }
}
