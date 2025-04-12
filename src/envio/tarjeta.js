import bcrypt from "bcryptjs";

export class Tarjeta {
    static #insertStmt = null;
    static #getByIdStmt = null;
    static #getByUserIdStmt = null;
    static #getNombreByIdStmt = null;
    static #getIdByUserIdStmt = null;

    #id;
    #usuario_id;     
    numero_tarjeta;
    fecha_expiracion;
    codigo_seguridad;
    nombre_titular;

    constructor(usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular) {
        this.#usuario_id = usuario_id; 
        this.numero_tarjeta = numero_tarjeta;
        this.fecha_expiracion = fecha_expiracion;
        this.codigo_seguridad = codigo_seguridad;
        this.nombre_titular = nombre_titular;
    }
    static initStatements(db) {
        if (this.#insertStmt !== null) return;

        this.#insertStmt = db.prepare(`
            INSERT INTO tarjeta (usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular)
            VALUES (@usuario_id, @numero_tarjeta, @fecha_expiracion, @codigo_seguridad, @nombre_titular)
        `);

        this.#getByIdStmt = db.prepare(`
            SELECT * FROM tarjeta WHERE id = @id
        `);

        this.#getByUserIdStmt = db.prepare(`
            SELECT * FROM tarjeta WHERE usuario_id = @usuario_id
        `);
        this.#getNombreByIdStmt = db.prepare(`
            SELECT nombre_titular FROM tarjeta WHERE usuario_id = @usuario_id
        `);
        this.#getIdByUserIdStmt = db.prepare(`
            SELECT id FROM tarjeta WHERE usuario_id = @usuario_id
        `);
        
    }

    static getIdTargetaById(usuario_id) {
        const result = this.#getIdByUserIdStmt.get({ usuario_id });
        if (!result) throw new TarjetaNoEncontrada(usuario_id);
        return result.id;
    }
    static getNombreById(usuario_id) {
        const result = this.#getNombreByIdStmt.get({ usuario_id });
        if (!result) throw new TarjetaNoEncontrada(usuario_id);
        return result.nombre_titular;
    }

    static getTarjetaById(id) {
        const tarjeta = this.#getByIdStmt.get({ id });
        if (tarjeta === undefined) throw new TarjetaNoEncontrada(id);
        return tarjeta;
    }

    static getTarjetasByUsuarioId(usuario_id) {
        return this.#getByUserIdStmt.all({ usuario_id });
    }
    static #insert(tarjeta) {
        let result = null;
            
            const usuario_id = tarjeta.#usuario_id;
                const numero_tarjeta = tarjeta.numero_tarjeta;
                const fecha_expiracion = tarjeta.fecha_expiracion;
                const codigo_seguridad = tarjeta.codigo_seguridad;
                const nombre_titular = tarjeta.nombre_titular;
                const datos = { usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular };
                console.log("Datos a insertar:", datos);
                result = this.#insertStmt.run(datos);
                tarjeta.#id = result.lastInsertRowid;
                return tarjeta;
    }

    static crearTarjeta(usuario_id, numero_tarjeta, fecha_expiracion, codigo_seguridad, nombre_titular) {
        const ultimos_cuatro_digitos = numero_tarjeta.slice(-4);

        const numero_tarjeta_encriptado = bcrypt.hashSync(numero_tarjeta.slice(0, -4), 10);
        const fecha_expiracion_encriptada = bcrypt.hashSync(fecha_expiracion);
        const codigo_seguridad_encriptado = bcrypt.hashSync(codigo_seguridad);
        const Ttarjeta = new Tarjeta(usuario_id, numero_tarjeta_encriptado + ultimos_cuatro_digitos, fecha_expiracion_encriptada, codigo_seguridad_encriptado, nombre_titular);
     
        return Ttarjeta.persist();
    }
    persist() {
        if(this.#id == undefined || this.#id == null) return Tarjeta.#insert(this); 
    }

}
export class TarjetaNoEncontrada extends Error {
    constructor(id) {
        super(`Tarjeta con id ${id} no encontrada`);
        this.name = 'TarjetaNoEncontrada';
    }
}
export class TarjetaYaExistente extends Error {
    constructor(usuario_id) {
        super(`Tarjeta con usuario_id ${usuario_id} ya existe`);
        this.name = 'TarjetaYaExistente';
    }
}