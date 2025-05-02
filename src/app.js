import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';
import productossRouter from './productos/router.js';
import imagenRouter from './imagenes/router.js';
import envioRouter from './envio/router.js';
import { logger } from './logger.js';
import pinoHttp  from 'pino-http';
const pinoMiddleware = pinoHttp(config.logger.http(logger));
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';
import chatRouter from './chat/router.js';
import pujaRouter from './pujas/router.js';
import pieRouter from './pie/router.js';


export const app = express();

// Configurar motor de vistas hhhhh
app.set('view engine', 'ejs');
app.set('views', config.vistas);

//Logger
app.use(pinoMiddleware);

// Middleware para manejar sesiones
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);
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
app.use('/productos', productossRouter);
app.use('/imagenes', imagenRouter);
app.use('/envios', envioRouter);
app.use('/chats', chatRouter);
app.use('/pujas', pujaRouter);
app.use('/pie',pieRouter);
app.use(errorHandler)