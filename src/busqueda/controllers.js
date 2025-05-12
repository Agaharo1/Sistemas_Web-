
export function mostrarResultados(req, res) {
  const { busqueda } = req.query;
  let productos = [];
  let imagenes = [];
  try{
   productos = Producto.buscarProducto(busqueda);
   imagenes = Imagen.getImagenByProductId(busqueda);

   const params = {
    contenido: "paginas/busqueda/busqueda",
    session: req.session,
    productos,
    imagenes
    };
  }catch(error){
    const params = {
      contenido: "paginas/busqueda/busqueda",
      session: req.session,
      productos,
      imagenes
    };
    res.render("pagina", params);
  }
 
}