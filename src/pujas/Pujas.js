import { logger } from '../logger.js';

/*
Atributos de Pujas:
-> id: id de la puja
-> valor: valor actual de la puja
-> id_user: el id de la persona que ha realizado la mayor puja hasta el momento
-> productoId: el id del producto por el que se está pujando
*/

export class Pujas {
  static #insertPujaStmt = null;
  static #getPujasByUserIdStmt = null;
  static #getPujaByIdStmt = null;
  static #getPujaByIdProductStmt = null;
  static #insertStmt = null;
  static #updateStmt = null;
  static #updateGanadorStmt = null;
  static #verTodasPujasStmt = null;

  id;
  id_p;
  id_u;
  id_ganador;
  valor_max;

  constructor (id_p, id_u, id_ganador = null, id, valor_max = null){
    this.id_p = id_p;
    this.id_u = id_u;
    this.id = id;
    this.id_ganador = id_ganador;
    this.valor_max = valor_max;
  }

  static initStatements(db) {
    if (this.#getPujasByUserIdStmt !== null) return;
    this.#getPujasByUserIdStmt = db.prepare(
      "SELECT p.id, p.id_p, p.id_u, p.valor_max AS lastPuja " +
      "FROM Pujas p " +
      "JOIN Usuarios u ON p.id_u = u.id " +
      "WHERE u.id = @usuarioId " +
      "GROUP BY p.id"
    );

    this.#verTodasPujasStmt = db.prepare(
      "SELECT * FROM Pujas"
    )

    this.#insertPujaStmt = db.prepare(
      "UPDATE Pujas SET valor_max = @valor WHERE Pujas.id = @id"
    )

    this.#getPujaByIdProductStmt = db.prepare(
      "SELECT * FROM Pujas p JOIN productos pr ON p.id_p = pr.id WHERE pr.id = @productoId GROUP BY p.id"
    )

    this.#getPujaByIdStmt = db.prepare(
      "SELECT * FROM Pujas WHERE id = @id"
    );

    this.#insertStmt = db.prepare(
      "INSERT INTO Pujas(id_u, id_p, id_ganador, valor_max) VALUES (@usuario, @producto, @ganador, @valor_max)"
    );
    this.#updateStmt = db.prepare(
      "UPDATE Pujas SET id_p = @producto, id_u = @usuario,  id_ganador = @ganador, valor_max = @valor_max WHERE Pujas.id = @puja"
    );
    this.#updateGanadorStmt = db.prepare(
      "UPDATE Pujas SET id_ganador = @ganador WHERE Pujas.id = @id"
    )
  }

  static verTodasPujas (){
    this.#verTodasPujasStmt.all();
  }

  static insertPujaStmt(id, valor, ganador){

    const puja = this.#getPujaByIdStmt(id);
    if (puja && parseFloat(valor) > puja.valor_max) {
      // Actualizar el valor de la puja en la base de datos
      this.#insertPujaStmt.run({ valor, id }); // Actualizamos la puja
      this.#updateGanadorStmt.run({ id, ganador }); // Actualizamos el ganador
      return this.getPujaByIdStmt(id); // Retornamos la puja actualizada
    } else {
      return null;
    }
  }

  static getPujaByIdStmt(id){
    const pujas = this.#getPujaByIdStmt({ id });

    if (pujas == undefined) return null;

    const pujaexistente = pujas.find(
      (puja) => (puja.id == id)
    )

    if (pujaexistente){
      logger.debug("Puja existente:", pujaexistente);
      return pujaexistente;
    }
    else{
      return null;
    }
  }

  static getPujasByUserId(usuarioId) {
    const pujas = this.#getPujasByUserIdStmt.all({ usuarioId });

    if (pujas == undefined) return null;

    const pujaexistente = pujas.find(
      (puja) => (puja.id_u == usuarioId)
    )

    if (pujaexistente){
      logger.debug("Puja existente:", pujaexistente);
      return pujaexistente;
    }
    else{
      return null;
    }
  }

  static getPujaByIdProductStmt(productoId){
    const pujas = this.#getPujaByIdProductStmt.all({ productoId });

    if (pujas == undefined) return null;

    const pujaexistente = pujas.find(
      (puja) => (puja.id_p == productoId)
    )

    if(pujaexistente){
      logger.debug("Puja existente:", pujaexistente);
      return pujaexistente;
    }
    else{
      return null;
    }
  }
  #insert(puja) 
  {
      const producto = puja.id_p;
      const usuario = puja.id_u;
      const ganador = puja.id_ganador;
      const valor_max = puja.valor_max;
      const { lastInsertRowid } = Pujas.#insertStmt.run({ producto:producto, id_u:usuario, id_ganador:ganador, valor_max:valor_max });
      puja.id = lastInsertRowid;
      return puja;
    }

  #update(puja) {
      const producto = puja.id_p;
      const usuario = puja.id_u;
      const ganador = puja.id_ganador;
      const valor_max = puja.valor_max;
      puja.#updateStmt.run({ producto, usuario, ganador, valor_max });
      return chat;
    }

  static crearPuja(id_u, id_p,id) {
      const nuevaPuja = new Pujas( id_p, id_u, null, id, null);
      console.log("Puja creada:", nuevaPuja);
      return nuevaPuja.persist();
    }
  
  persist() {
      if (this.id === null) return this.#insert(this);
      return this.#update(this);
    }
}