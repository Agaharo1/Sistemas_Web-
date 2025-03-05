export class Producto {
    static #getByUserIdStmt = null;
    static #getAllStmt = null;
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
        this.#getByUserIdStmt = db.prepare('');
        this.#insertStmt = db.prepare('');
        this.#updateStmt = db.prepare('');
        this.#getAllStmt = db.prepare('SELECT nombre, precio FROM productos');
    }

    static getProductByUserId(user_id) {
            const producto = this.#getByUserIdStmt.get({ user_id });
            if (producto === undefined) throw new UsuarioNoEncontrado(user_id);
    
            const { id, password, nombre,rol} = usuario;
            console.log('Usuario recibido de la BD:', usuario);
            return new Usuario(username, password, nombre, rol, id);
        }
    static getProducts() {
        const productos = this.#getAllStmt.all();
        return productos;
    }



    static crearProducto(nombre, descripcion, precio,imagen) {
        console.log('Creando producto:', nombre);
        const Tproducto = new Producto(nombre, descripcion, precio,imagen);
        Tproducto.nombre = nombre;
        console.log('Producto creado:', Tproducto.#nombre);
        return Tproducto;
    }   

}