import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';

export const app = express();

// Configurar motor de vistas hhhhh
app.set('view engine', 'ejs');
app.set('views', config.vistas);

// Middleware para manejar sesiones
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

// Servir archivos estáticos
app.use('/', express.static(config.recursos));

// Ruta principal
app.get('/', (req, res) => {
    const params = {
        contenido: 'paginas/index',
        session: req.session
    };
    res.render('pagina', params);
});

// Usar routers
app.use('/usuarios', usuariosRouter);
app.use('/contenido', contenidoRouter);