import { Usuario } from "./usuarios/Usuario.js";
import { Producto } from "./productos/Productos.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Producto.initStatements(db);
}