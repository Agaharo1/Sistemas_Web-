import { PuntoRecogida } from "./puntoRecogida.js";
import { Producto } from "../productos/Productos.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Imagen } from "../imagenes/Imagen.js";



export function formularioPuntoRecogida(req, res) {
    const { id } = req.params;
    const puntoRecogida = PuntoRecogida.getPuntoRecogidaById(id);
    const params = {
      contenido: "paginas/envios/formPuntoRecogida",
      session: req.session,
      puntoRecogida
      
    };
    res.render("pagina", params);
  
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
    const params = {
      contenido: "paginas/envios/resumenProducto",
      session: req.session,
      producto,
      usuario,
      imagen
    };
    res.render("pagina", params);
  }
