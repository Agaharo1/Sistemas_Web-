import express from 'express';
import {mostrarResultados} from './controllers.js';

const busquedaRouter = express.Router();

busquedaRouter.get('/buscar', mostrarResultados);
export default busquedaRouter;






/*

app.get('/buscar', (req, res) => {
    const query = req.query.query; // Obtiene el término de búsqueda desde el formulario
    // Aquí puedes implementar la lógica para buscar en tu base de datos o lista de elementos
    const resultados = []; // Reemplaza esto con los resultados reales de tu búsqueda

    // Ejemplo de búsqueda en una lista de productos
    const productos = [
        { nombre: 'Manzana', precio: 1 },
        { nombre: 'Banana', precio: 2 },
        { nombre: 'Cereza', precio: 3 },
    ];

    if (query) {
        resultados.push(...productos.filter(producto =>
            producto.nombre.toLowerCase().includes(query.toLowerCase())
        ));
    }

    // Renderiza una vista con los resultados
    res.render('resultados', { query, resultados });
});*/