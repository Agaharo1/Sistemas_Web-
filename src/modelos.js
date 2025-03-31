import { Usuario } from "./usuarios/Usuario.js";
import { Producto } from "./productos/Productos.js";
import { Imagen } from "./imagenes/Imagen.js";
import { PuntoRecogida } from './envio/puntoRecogida.js';

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Producto.initStatements(db);
    Imagen.initStatements(db);
    PuntoRecogida.initStatements(db);
}