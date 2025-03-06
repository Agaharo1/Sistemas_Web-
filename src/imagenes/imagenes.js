export class imagen{
    static #getByImgIdStmt = null;
    static #getAllStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    nombre;
    ruta;
    #id;
    #id_p;

    constructor(nombre,ruta,id_producto,id =null){
        this.nombre = nombre;
        this.ruta = ruta;
        this.#id = id;
        this.#id_p = id_producto;
    }
    static initStatements(db) {
        if (this.#getByImgIdStmt !== null) return;
        this.#getByImgIdStmt = db.prepare(
          "SELECT  nombre, ruta,id_producto FROM imagenes WHERE id_producto = @id_producto"
        );
        this.#insertStmt = db.prepare(
          "INSERT INTO imagenes(id_producto,ruta,nombre) VALUES (@id_producto, @ruta, @nombre)",
        );
        this.#updateStmt = db.prepare(
          "UPDATE imagenes SET nombre = @nombre, ruta = @ruta WHERE id_productos = @id_productos"
        );
        this.#getAllStmt = db.prepare("SELECT nombre,ruta, id_producto FROM imagenes");
    }   
    static getProductByUserId(id_u) {
        const imagen = this.#getByImgIdStmt.get({ id_u });
        if (imagen === undefined) throw new imagenNoEncontrada(nombre);
        console.log("Imagen recibido de la BD:", imagen);
        return new imagen(nombre, ruta,id, id_producto);
      }  

      static getImagenes() {
        const imagenes = this.#getAllStmt.all();
        return imagenes;
      }

      static #insert(imagen) {
        let result = null;
        const nombre = imagen.nombre;
        const ruta = imagen.ruta;
        const id = imagen.id;
        const id_p = imagen.#id_p;
        const datos = {nombre,ruta,id,id_p};
        console.log("Imagen insertada:", datos);
        result = this.#insertStmt.run(datos);
    
        producto.#id = result.lastInsertRowid;
    
        return producto;
      }

      static #update(imagen) {
        const nombre = imagen.nombre;
        const ruta = imagen.ruta;
        const id = imagen.#id;
        const id_p = imagen.#id_p;
        const datos = {nombre,ruta,id,id_p};
    
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new imagenNoEncontrada(username);
        return usuario;
      }
      static crearImagen(nombre, ruta, id,id_p) {
        const Timagen = new imagen(nombre, ruta,id,id_p);
        Timagen.nombre = nombre;
        console.log("Producto creado:", Tproducto.nombre);
        return Timagen.persist();
      }

      persist() {
        if (this.#id === null) return imagen.#insert(this);
        return imagen.#update(this);
      }

}

export class imagenNoEncontrada extends Error {
    /**
     *
     * @param {string} nombre
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
      super(`imagen no encontrado: ${nombre}`, options);
      this.name = "imagenNoEncontrada";
    }
  }