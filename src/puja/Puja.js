import { logger } from '../logger.js';

//Puja: chat, Pujar: mensaje

export class Puja{
    static #getByUserIdStmt = null;
    static #getAllStmt = null;
    static #getPujarStmt = null;
    static #getPujaByProductIdStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;
    static #insertPujarStmt = null;
    static #lastPujarIdStmt = null;
    static #getPujaByIdStmt = null;
    static #deletePujaStmtProductId = null;
    static #PujaByIdStmt = null;
    static #getPujasStmt = null;
    static #selectPujaStmtProductId = null;
    valor_max;
    id_u;
    id;
    #id_p;

    constructor({ id_producto, id = null, id_u = null, valor_max = 0 }) {
        this.id = id;
        this.#id_p = id_producto;
        this.id_u = id_u;
        this.valor_max = valor_max;
    }

    static initStatements(db) {
        if (this.#getByUserIdStmt !== null) return;
        this.#getByUserIdStmt = db.prepare(
          `SELECT *
           FROM Puja p
           WHERE (p.id_u == @usuario)`
        );
        this.#selectPujaStmtProductId = db.prepare(
          "SELECT id FROM Puja WHERE producto = @id_producto"
        );
        this.#getPujaByProductIdStmt = db.prepare(
            "SELECT id, id_u, producto, valor_max FROM Puja WHERE producto = @id_producto"
        );
        this.#insertStmt = db.prepare(
          "INSERT INTO Puja(producto, id_u, valor_max) VALUES (@producto, @usuario, @valor_max)"
        );
        this.#updateStmt = db.prepare(
          "UPDATE Puja SET id_u = @id_u WHERE producto = @id_p"
        );
        this.#getAllStmt = db.prepare(
            "SELECT id, id_u, valor_max, producto FROM Puja"
        );
        this.#deletePujaStmtProductId = db.prepare(
            "DELETE FROM Puja WHERE producto = @productId"
        );
        this.#getPujarStmt = db.prepare(
            "SELECT valor, id_u FROM Pujar WHERE id_puja = @id_puja"
        );
        this.#insertPujarStmt = db.prepare(
            "INSERT INTO Pujar(id_puja, valor, id_u) VALUES (@id_puja, @valor, @id_u)"
        );
        this.#lastPujarIdStmt = db.prepare(
            "SELECT id FROM Pujar WHERE id_puja = @id_puja ORDER BY id DESC LIMIT 1"
        );
        this.#getPujaByProductIdStmt = db.prepare(
            "SELECT id, producto, id_u, valor_max FROM Puja WHERE producto = @id_producto"
        );
        this.#getPujaByIdStmt = db.prepare(
            "SELECT id, id_u, producto, valor_max FROM Puja WHERE id = @id_puja"
        );
        this.#deletePujaStmtProductId = db.prepare(
            "DELETE FROM Pujar WHERE id_puja = @id_puja"
        );
        this.#deleteStmt = db.prepare(
            "DELETE FROM Puja WHERE id = @id"
        );
        this.#getPujasStmt = db.prepare(
            "SELECT valor, id_u FROM Pujar WHERE id_puja = @id_puja"
        );
    }

    //Mostrar las pujas de un usuario dada su sesión
    static getPujaByUser(id_user_sesion) {
        const puja = this.#getByUserIdStmt.all({usuario:id_user_sesion});
        if (puja === undefined)return null;
        const pujaExistente = puja.find(
            (puja) =>
                ((puja.id_u === id_user_sesion))                
            );
        if (pujaExistente) {
            logger.debug("Puja existente:", pujaExistente);
            return pujaExistente;
        } else {
            return null;
        }
    }

    static getPujaByProductId(id_producto){
            let puja = this.#getPujaByProductIdStmt.all({id_producto:id_producto});

        if (puja === 0){
            console.log('No existe puja para este producto');
        }
        else{
            return puja;
        }
    }
    
    //Eliminar una puja dado su id
    static eliminarPuja(id) {
        const result = this.#deleteStmt.run({ id:id });
           
        logger.debug("Puja eliminada:", result.changes);
        
    }

    //Eliminar una puja dado el id del producto
    static eliminarPujaByProduct(productId){
        //Guardamos los ids de los chats que se eliminan
        let puja = this.#selectPujaStmtProductId.all({id_producto:productId});
        if(puja === undefined) return logger.debug("No se ha encontrado ninguna puja para este producto:", productId);
    
        const result = this.#deletePujaStmtProductId.run({id_producto: productId });
        logger.debug("Puja eliminada:", result.changes);
    }

    //Obtener una puja por su id
    static getPujaById(id_puja) {
        const puja = this.#getPujaByIdStmt.get({ id_puja });
        if (puja === undefined) throw new PujaNoEncontrada(id_puja);
        logger.debug("Puja encontrada:", puja);
        return puja;
    }

    //Obtener una pujada por el id de la puja en si
    static getPujadasByPujaId(id_puja) {
        const pujadas = this.#getPujasStmt.all({ id_puja });
        logger.debug("Pujadas encontradas:", pujadas);
        return pujadas;
    }

    static #insert(puja) 
    {
        const producto = puja.#id_p;
        const id_u = puja.id_u;
        const valor_max = puja.valor_max;
        const info = Puja.#insertStmt.run({ producto: producto, usuario: id_u, valor_max: valor_max });
        puja.id = info.lastInsertRowid || info.lastInsertRowId || info.lastID;
        return puja;
    }

    static #update(puja) {
        const producto = puja.#id_p;
        const id_u = puja.id_u;
        Puja.#updateStmt.run({ id_p: producto, id_u: id_u});
        return puja;
    }

    static crearPuja(id_u, id_producto, id = null) {
        console.log(id_u, id_producto);
        const nuevaPuja = new Puja({ id_producto, id_u });
        console.log("Puja creada:", nuevaPuja);
        return nuevaPuja.persist();
    }
    
    static pujar(id_puja, valor, id_u) {
        const nuevaPujada = { id_puja, valor, id_u };
        const { lastInsertRowid } = this.#insertPujarStmt.run(nuevaPujada);
        nuevaPujada.id = lastInsertRowid;
        return nuevaPujada;
    }

    persist() {
        if (this.id === null) return Puja.#insert(this);
        return Puja.#update(this);
    }

}

export class PujaNoEncontrada extends Error {
    /**
     *
     * @param {string} id
     * @param {ErrorOptions} [options]
     */
    constructor(id, options) {
      super(`Puja no encontrada: ${id}`, options);
      this.name = "PujaNoEncontrada";
    }
  }