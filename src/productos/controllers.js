import { body } from 'express-validator';

export function viewSubirProducto(req, res) {

    const params = {
        contenido: 'paginas/productos/subirProducto',
        session: req.session
    }
    res.render('pagina', params)

}

export function doSubirProducto(req, res) {
    //TODO
}