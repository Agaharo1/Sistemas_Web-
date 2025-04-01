import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";



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
    const params = {
      contenido: "paginas/envios/formEnvioProducto",
      session: req.session,
      id
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
  
    const params = {
      contenido: "paginas/envios/resumenProducto",
      session: req.session,
      producto,
      usuario,
      imagen,
      puntoRecogida
    };
    res.render("pagina", params);
  }
