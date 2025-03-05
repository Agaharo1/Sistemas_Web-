export class Producto {
    static #getByUserIdStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    #nombre;
    #descripcion;
    #precio;
    #imagen;

    constructor(nombre, descripcion, precio,imagen) {
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#precio = precio;
        this.#imagen = imagen;

    }

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



    static crearProducto(nombre, descripcion, precio,imagen) {
        console.log('Creando producto:', nombre);
        const Tproducto = new Producto(nombre, descripcion, precio,imagen);
        Tproducto.nombre = nombre;
        console.log('Producto creado:', Tproducto.#nombre);
        return Tproducto;
    }   

}