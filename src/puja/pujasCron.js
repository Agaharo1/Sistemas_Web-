import cron from 'node-cron';
import { Puja } from '../puja/Puja.js';
import { Producto } from '../productos/Productos.js';

cron.schedule('* * * * * *', () => {
    const ahora = Date.now();
    const expiradas = Puja.getPujasExpiradas(ahora);

    expiradas.forEach(puja => {
        Producto.marcarComoVendido(puja.producto, puja.id_u);
        Puja.eliminarPuja(puja.id);
    });
});