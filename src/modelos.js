import { Usuario } from "./usuarios/Usuario.js";
import { Producto } from "./productos/Productos.js";
import { Imagen } from "./imagenes/Imagen.js";
import { PuntoRecogida } from './envio/puntoRecogida.js';
import { Chat } from "./chat/Chat.js";
import { Puja } from "./puja/Puja.js";
import { DirEnvio } from "./envio/direccionEnt.js";
import { Tarjeta } from "./envio/tarjeta.js";
import { compra } from "./envio/compra.js";


export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Producto.initStatements(db);
    Imagen.initStatements(db);
    PuntoRecogida.initStatements(db);
    Chat.initStatements(db);
    DirEnvio.initStatements(db);
    Tarjeta.initStatements(db);
    compra.initStatements(db);
    Puja.initStatements(db);
}