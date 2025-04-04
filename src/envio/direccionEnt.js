export class DirEnvio {
    static #insertStmt = null;
    static #getByIdStmt = null;
    static #getByUserIdStmt = null;

    #id;
    #usuario_id ;     
    nombre ;
    codigo_postal ;
    telefono ;
    #dni ;
    direccion_entrega;
    punto_recogida ;

    constructor(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida) {
        this.#usuario_id = usuario_id; 
        this.nombre = nombre;
        this.codigo_postal = codigo_postal;
        this.telefono = telefono;
        this.#dni = dni;
        this.direccion_entrega = direccion_entrega;
        this.punto_recogida = punto_recogida;
    }
    static initStatements(db) {
        if (this.#insertStmt !== null) return;

        this.#insertStmt = db.prepare(`
            INSERT INTO direccion (usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida)
            VALUES (@usuario_id, @nombre, @codigo_postal, @telefono, @dni, @direccion_entrega, @punto_recogida)
        `);

        this.#getByIdStmt = db.prepare(`
            SELECT * FROM direccion WHERE id = @id
        `);

        this.#getByUserIdStmt = db.prepare(`
            SELECT * FROM direccion WHERE usuario_id = @usuario_id
        `);
    }

    static getDireccionById(id) {
        const direccion = this.#getByIdStmt.get({ id });
        if (direccion === undefined) throw new DireccionNoEncontrada(id);
        return direccion;
    }

    static getDireccionesByUsuarioId(usuario_id) {
        return this.#getByUserIdStmt.all({ usuario_id });
    }

    static #insert(direccion) {
        let result = null;
        
           const usuario_id = direccion.#usuario_id;
            const nombre = direccion.nombre;
            const codigo_postal = direccion.codigo_postal;
            const telefono = direccion.telefono;
            const dni = direccion.#dni;
            const direccion_entrega = direccion.direccion_entrega;
            const punto_recogida = direccion.punto_recogida;
            const datos = { usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida };
            
            console.log("Datos a insertar:", datos);
            result = this.#insertStmt.run(datos);   
            direccion.#id = result.lastInsertRowid;
            console.log("ID de la dirección insertada:", direccion.#id);
            return direccion;
        
    }

    static  crearDireccion(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida) {
    const Tdireccion = new DirEnvio(usuario_id, nombre, codigo_postal, telefono, dni, direccion_entrega, punto_recogida);
    return Tdireccion.persist();
}
    persist() {
        
        if (this.#id === null|| this.#id === undefined) return DirEnvio.#insert(this); 
    //return Usuario.#update(this);
    }
}

export class DireccionNoEncontrada extends Error {
    constructor(id, options) {
        super(`Dirección no encontrada: ${id}`, options);
        this.name = 'DireccionNoEncontrada';
    }
}

export class ErrorDatos extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'ErrorDatos';
    }
}