export class Imagen{
    static #getByImgIdStmt = null;
    static #getAllStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;

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
          "SELECT  nombre, ruta FROM Imagenes WHERE id_producto = @id_producto"
        );
        this.#insertStmt = db.prepare(
          "INSERT INTO Imagenes(id_producto,ruta,nombre) VALUES (@id_producto, @ruta, @nombre)",
        );
        this.#updateStmt = db.prepare(
          "UPDATE Imagenes SET nombre = @nombre, ruta = @ruta WHERE id_producto = @id_producto"
        );
        this.#getAllStmt = db.prepare("SELECT nombre,ruta, id_producto FROM Imagenes");
        this.#deleteStmt = db.prepare("DELETE FROM Imagenes WHERE id_producto = @id_producto");
    }  
    
    static eliminarImagen(id_producto) {
        const result = this.#deleteStmt.run({ id_producto });
        if (result.changes === 0) throw new ImagenNoEncontrada(id_producto);
      }
    static getImagenByProductId(id_producto) {
        const {nombre,ruta} = this.#getByImgIdStmt.get({ id_producto });
        const datos = {nombre,ruta};
        if (datos === undefined) throw new ImagenNoEncontrada(id_producto);
        console.log("Imagen recibido de la BD:", datos);
        return nombre;
      }  

      static getImagenes() {
        const Imagenes = this.#getAllStmt.all();
        return Imagenes;
      }

      static #insert(Imagen) {
        let result = null;
        const nombre = Imagen.nombre;
        const ruta = Imagen.ruta;
        const id_producto = Imagen.#id_p;
        const datos = {nombre,ruta,id_producto};
        console.log("Imagen insertada:", datos);
        result = this.#insertStmt.run(datos);
        
        if(result.changes === 0) throw new Error("No se ha podido insertar la imagen");
        
    
        return Imagen;
      }

      static #update(Imagen) {
        const nombre = Imagen.nombre;
        const ruta = Imagen.ruta;
        const id = Imagen.#id;
        const id_p = Imagen.#id_p;
        const datos = {nombre,ruta,id,id_p};
    
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new ImagenNoEncontrada(username);
        return usuario;
      }
      static crearImagen(nombre, ruta, id_p,id) {
        const TImagen = new Imagen(nombre, ruta,id_p,id);
        console.log("Imagen creada:", TImagen);
        return TImagen.persist();
      }

      persist() {
        if (this.#id === null) return Imagen.#insert(this);
        return Imagen.#update(this);
      }

}

export class ImagenNoEncontrada extends Error {
    /**
     *
     * @param {string} nombre
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
      super(`Imagen no encontrado: ${nombre}`, options);
      this.name = "ImagenNoEncontrada";
    }
  }