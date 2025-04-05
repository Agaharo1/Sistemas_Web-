
import bcrypt from "bcryptjs";

export const RolesEnum = Object.freeze({
    USUARIO: 'U',
    ADMIN: 'A'
});

export class Usuario {
    static #getByUsernameStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt= null;
    static #getByIdStmt = null;

    static initStatements(db) {
        if (this.#getByUsernameStmt !== null) return;

        this.#getByUsernameStmt = db.prepare('SELECT id,password,nombre,rol FROM Usuarios WHERE username = @username');
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, nombre, rol) VALUES (@username, @password, @nombre, @rol)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, nombre = @nombre WHERE id = @id');
        this.#deleteStmt = db.prepare('DELETE FROM Usuarios WHERE username = @username');
        this.#getByIdStmt = db.prepare('SELECT username,nombre FROM Usuarios WHERE id = @id');
    }

    static getUsuarioById(id) {
        const usuario = this.#getByIdStmt.get({ id });
        if (usuario === undefined) throw new UsuarioNoEncontrado(id);
        return usuario;
    }

    static getUsuarioByUsername(username) {
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario === undefined) throw new UsuarioNoEncontrado(username);

        const { id, password, nombre,rol} = usuario;
        console.log('Usuario recibido de la BD:', usuario);
        return new Usuario(username, password, nombre, rol, id);
    }

    static #insert(usuario) {
        let result = null;
        try {
            const username = usuario.#username;
            const password = usuario.#password;
            const nombre = usuario.nombre;
            const rol = usuario.rol;
            const datos = {username, password, nombre, rol};

            result = this.#insertStmt.run(datos);

            usuario.#id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new UsuarioYaExiste(usuario.#username);
            }
            throw new ErrorDatos('No se ha insertado el usuario', { cause: e });
        }
        return usuario;
    }

    static #update(usuario) {
        const username = usuario.#username;
        const password = usuario.#password;
        const nombre = usuario.nombre;
        const rol = usuario.rol;
        const datos = {username, password, nombre, rol};

        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new UsuarioNoEncontrado(username);

        return usuario;
    }

    static #delete(usuario) {
        const usuario_d = this.getUsuarioByUsername(usuario.username);
        const result = this.#deleteStmt.run({ username: usuario_d.username });

        if (result.changes === 0) {
            throw new UsuarioNoEncontrado(usuario.username);
        }

        return usuario;
    }

    static async editarPerfil(nombre, username, password, id) {
        console.log('Intentando editar el perifl con ID: ', id);
        const usuario = this.getUsuarioById(id);
    
        if (!usuario) {
            throw new UsuarioNoEncontrado(id);
        }

        console.log('Usuario encontrado');
    
        usuario.nombre = nombre;
        usuario.#username = username;
    
        if (password) {
            usuario.password = password;
        }

        console.log("Usuario después de la actualización:", usuario);
    
        const result = usuario.persist();
    
        console.log("Resultado de persistencia en BD:", result);

        if (result.changes === 0) {
            throw new UsuarioNoEncontrado(id);
        }
    
        return usuario;
    }

    static eliminarUsuario(username, password) {
        try {
            // Obtener usuario y verificar contraseña
            const usuario = this.getUsuarioByUsername(username);
            if (!bcrypt.compareSync(password, usuario.#password)) {
                throw new UsuarioOPasswordNoValido(username);
            }
    
            // Si la contraseña es correcta, proceder con la eliminación
            this.#delete(usuario);
            
        } catch (e) {
            // Solo relanzamos el error si no es del tipo esperado
            if (!(e instanceof UsuarioNoEncontrado || e instanceof UsuarioOPasswordNoValido)) {
                throw new Error('Error inesperado al eliminar usuario', { cause: e });
            }
            throw e;
        }
    }


    static async login(username, password) {
        let usuario = null;
        try {
            usuario = this.getUsuarioByUsername(username);
        } catch (e) {
            throw new UsuarioOPasswordNoValido(username, { cause: e });
        }
      
        
        const isPasswordValid = await bcrypt.compare(password, usuario.#password);
        if (!isPasswordValid) {
            throw new UsuarioOPasswordNoValido(username);
        }
        return usuario;
    }

    static async crearUsuario(username, password, nombre) {
        const Tusuario = new Usuario(username, password, nombre);
        await Tusuario.cambiaPassword(password);
        
        try {
            this.getUsuarioByUsername(username);
            throw new UsuarioYaExiste(username); // si lo anterior no lanza excepción, es que ya existe el usuario
        } catch (e) {
            if (e instanceof UsuarioNoEncontrado) {
                return Tusuario.persist();
            }
            throw e;
        }
        
        
    }
    async cambiaPassword(nuevoPassword) {
            
        this.#password = bcrypt.hashSync(nuevoPassword);    
    }
    #id;
    #username;
    #password;
    rol;
    nombre;

    constructor(username, password, nombre, rol = RolesEnum.USUARIO, id = null) {
        this.#username = username;
        this.#password = password;
        this.nombre = nombre;
        this.rol = rol;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set password(nuevoPassword) {
        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        this.#password = bcrypt.hashSync(nuevoPassword);
    }

    get username() {
        return this.#username;
    }

    persist() {
        if (this.#id === null) return Usuario.#insert(this);
        return Usuario.#update(this);
    }
}

export class UsuarioNoEncontrado extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario no encontrado: ${username}`, options);
        this.name = 'UsuarioNoEncontrado';
    }
}

export class UsuarioOPasswordNoValido extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario o password no válido: ${username}`, options);
        this.name = 'UsuarioOPasswordNoValido';
    }
}


export class UsuarioYaExiste extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario ya existe: ${username}`, options);
        this.name = 'UsuarioYaExiste';
    }
}