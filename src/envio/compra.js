export class compra {
    static #insertStmt = null;
    static #getByIdStmt = null;
    static #getByUserIdStmt = null;
    static #getProductoIdsByUserIdStmt = null;
    #id;
    #usuario_id ;
    
    producto_id;
    precio;
    direccion_entrega;
    dni;
    telefono;
    nombre;
    tarjeta_id;
    numero_tarjeta;
    nombre_titular;
    constructor( producto_id, precio,direccion_entrega, dni, telefono, nombre,usuario_id,tarjeta_id,numero_tarjeta,nombre_titular) {
        this.usuario_id = usuario_id;

        this.producto_id = producto_id;
        this.precio = precio;
        this.direccion_entrega = direccion_entrega;
        this.dni = dni;
        this.telefono = telefono;
        this.nombre = nombre;
        this.tarjeta_id = tarjeta_id;
        this.numero_tarjeta = numero_tarjeta;
        this.nombre_titular = nombre_titular;
    }



    static initStatements(db) {
        if (this.#insertStmt !== null) return;
        this.#insertStmt = db.prepare(`
            INSERT INTO compra ( producto_id, precio,direccion_entrega, dni, telefono, nombre,usuario_id,tarjeta_id,numero_tarjeta,nombre_titular) 
            VALUES (@producto_id, @precio,@direccion_entrega, @dni, @telefono, @nombre,@usuario_id, @tarjeta_id,@numero_tarjeta, @nombre_titular)
        `);
        this.#getByIdStmt = db.prepare(`
            SELECT * FROM compra WHERE id = @id
        `);
        this.#getByUserIdStmt = db.prepare(`
            SELECT * FROM compra WHERE usuario_id = @usuario_id
        `);
        this.#getProductoIdsByUserIdStmt = db.prepare(`
            SELECT producto_id FROM compra WHERE usuario_id = @usuario_id
        `);
    }

    static getIdProductoByUsuarioId(usuario_id) {
     return this.#getProductoIdsByUserIdStmt.all({ usuario_id });
    }
    static getCompraById(id) {
        const compra = this.#getByIdStmt.get({ id });
        if (compra === undefined) throw new CompraNoEncontrada(id);
        return compra;
    }
    static getComprasByUsuarioId(usuario_id) {
        return this.#getByUserIdStmt.all({ usuario_id });
    }
    static #insert(compra) {
        let result = null;

        const producto_id = compra.producto_id;
        const precio = compra.precio;
        const direccion_entrega = compra.direccion_entrega;
        const dni = compra.dni;
        const telefono = compra.telefono;
        const nombre = compra.nombre;
        const usuario_id = compra.usuario_id;
        const tarjeta_id = compra.tarjeta_id;
        const numero_tarjeta = compra.numero_tarjeta;
        const nombre_titular = compra.nombre_titular;
        
        try {
            result = this.#insertStmt.run({  producto_id, precio,direccion_entrega, dni, telefono, nombre,usuario_id,tarjeta_id,numero_tarjeta,nombre_titular });
            return result.lastInsertRowid;
        } catch (error) {
            throw new Error("Error al insertar la compra: " + error.message);
        }
    }
    static crearCompra( producto_id, precio,direccion_entrega, dni, telefono, nombre,usuario_id,tarjeta_id,numero_tarjeta,nombre_titular) { 
        const Tcompra = new compra( producto_id, precio,direccion_entrega, dni, telefono, nombre,usuario_id, tarjeta_id,numero_tarjeta,nombre_titular);
        return Tcompra.persist();}

    persist() {
        if (this.#id === null|| this.#id === undefined) return compra.#insert(this);
    }
}