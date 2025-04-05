export function mostrarBusqueda(req, res) {
  const { busqueda } = req.query;
  const productos = Producto.buscarProducto(busqueda);
  const imagenes = Imagen.getImagenByProductId(busqueda);
  const params = {
    contenido: "paginas/busqueda/busqueda",
    session: req.session,
    productos,
    imagenes
  };
  res.render("pagina", params);
}