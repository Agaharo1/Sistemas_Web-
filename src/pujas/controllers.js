import { Pujas } from './Pujas.js';

export function nuevaPuja(req, res) {
  const { id } = req.params;
  const { id_p, id_u } = req.query;

  // Comprobamos si ya existe una puja para este producto
  const pujaExistente = Pujas.getPujaByIdStmt(id);
  
  if (pujaExistente !== null) {
    // Si existe, redirigimos a la puja existente
    return res.redirect(`/pujas/puja/${pujaExistente.id}`);
  }

  // Creamos una nueva puja (sin pasar id)
  const nuevaPuja = Pujas.crearPuja(id_p, id_u);  // 🔧 corregido: no pasar id

  if (nuevaPuja) {
    res.redirect(`/pujas/puja/${nuevaPuja.id}`);
  } else {
    res.status(500).send("Error al crear la puja");
  }
}

export function enviarPuja(req, res) {
  const { valor, id, id_u } = req.body;

  // Comprobamos si la puja existe y si el valor de la nueva puja es mayor
  const pujaExistente = Pujas.getPujaByIdStmt(id);

  if (pujaExistente) {
    if (parseFloat(valor) > pujaExistente.valor_max) {
      // Actualizamos la puja con el nuevo valor
      const nuevaPuja = Pujas.insertPujaStmt(id, valor, id_u);
      if (nuevaPuja) {
        res.redirect(`/pujas/puja/${nuevaPuja.id}`);
      } else {
        res.status(500).send("Error al actualizar la puja.");
      }
    } else {
      res.status(400).send("La puja debe ser mayor que el valor actual.");
    }
  } else {
    res.status(404).send("Puja no encontrada.");
  }
}

export function verPujas(req, res) {
  const pujas = Pujas.verTodasPujas(); 
  const params = {
    contenido: "paginas/pujas/pujas",
    session: req.session,
    pujas
  };
  res.render("pagina", params);
}

export function verPuja(req, res) {
  const { id } = req.params;
  const puja = Pujas.getPujaByIdProductStmt(id);

  const params = {
    contenido: "paginas/pujas/puja",
    session: req.session,
    puja
  };
  res.render("pagina", params);
}

export function iniciarOcrearPuja(req, res) {
  const { id } = req.params;
  const id_u = req.session.user_id;

  const pujaExistente = Pujas.getPujaByIdProductStmt(id);
  if (pujaExistente) {
    return res.redirect(`/pujas/puja/${pujaExistente.id}`);
  }

  const nuevaPuja = Pujas.crearPuja(id_u, id, null); // productoId, userId, id (null porque se autogenera)
  if (nuevaPuja) {
    return res.redirect(`/pujas/puja/${nuevaPuja.id}`);
  } else {
    return res.status(500).send("Error al crear la puja.");
  }
}

export function viewMisPujas(req, res) {
  const userId = parseInt(req.session.user_id);

  // Obtenemos todas las pujas hechas por el usuario
  const pujas = Pujas.getPujasByUserId(userId);

  const params = {
    contenido: "paginas/pujas/misPujas",
    session: req.session,
    pujas
  };

  res.render("pagina", params);
}
