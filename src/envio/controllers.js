import { PuntoRecogida } from "./puntoRecogida.js";



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

