export class Producto {
    static #getByUserIdStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    static initStatements(db) {
        if (this.#getByUserIdStmt !== null) return;
        // TODO
        this.#getByUserIdStmt = db.prepare('SELECT id,id_user,nombre,descripcion,precio FROM productos WHERE id_user = @id_user');
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, nombre, rol) VALUES (@username, @password, @nombre, @rol)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, nombre = @nombre WHERE id = @id');
    }

    static getProductByUserId(user_id) {
            const producto = this.#getByUserIdStmt.get({ user_id });
            if (producto === undefined) throw new UsuarioNoEncontrado(user_id);
    
            const { id, password, nombre,rol} = usuario;
            console.log('Usuario recibido de la BD:', usuario);
            return new Usuario(username, password, nombre, rol, id);
        }

}