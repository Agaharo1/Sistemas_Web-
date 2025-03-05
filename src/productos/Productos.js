export class Producto {
    static #getByUserIdStmt = null;
    static #getAllStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    nombre;
    descripcion;
    precio;
    imagen;
    #id
    #user_id

    constructor(nombre, descripcion, precio, imagen, id = null) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.#id = id
    }

    static initStatements(db) {
        if (this.#getByUserIdStmt !== null) return;
        this.#getByUserIdStmt = db.prepare('SELECT id, nombre, precio, imagen FROM productos WHERE user_id = @user_id');
        this.#insertStmt = db.prepare('INSERT INTO productos(nombre, descripcion, precio, imagen) VALUES (@nombre, @descripcion, @precio, @imagen)');
        this.#updateStmt = db.prepare('UPDATE productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio, imagen = @imagen');
        this.#getAllStmt = db.prepare('SELECT nombre, precio FROM productos');
    }

    static getProductByUserId(user_id) {
            const producto = this.#getByUserIdStmt.get({ user_id });
            if (producto === undefined) throw new ProductoNoEncontrado(nombre);
    
            const { id, password, nombre,rol} = producto;
            console.log('Producto recibido de la BD:', producto);
            return new Producto(nombre, descripcion, precio, imagen);
        }
    static getProducts() {
        const productos = this.#getAllStmt.all();
        return productos;
    }



    static crearProducto(nombre, descripcion, precio,imagen) {
        console.log('Creando producto:', nombre);
        const Tproducto = new Producto(nombre, descripcion, precio,imagen);
        Tproducto.nombre = nombre;
        console.log('Producto creado:', Tproducto.nombre);
        return Tproducto;
    }   

}

export class ProductoNoEncontrado extends Error {
    /**
     * 
     * @param {string} nombre 
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
        super(`Producto no encontrado: ${nombre}`, options);
        this.name = 'ProductoNoEncontrado';
    }
}