import express from 'express';

import { config } from '../config.js';
import { formularioPuntoRecogida,formularioEnvioProducto,envioProducto,mostarHistorial,formularioTarjeta,mostrarTicket,crearDireccion,crearPuntoRecogida,crearTarjeta,confirmacionCompra} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 
import { body } from 'express-validator';

const envioRouter = express.Router();


envioRouter.get('/formPuntoRecogida/:id', autenticado('/usuarios/login'), formularioPuntoRecogida);
envioRouter.get('/formEnvioProducto/:id', autenticado('/usuarios/login'), formularioEnvioProducto);
envioRouter.get('/resumenProducto/:id', autenticado('/usuarios/login'), envioProducto); 
envioRouter.post('/formPuntoRecogida/:id',
    [
        autenticado('/usuarios/login'),
        body('nombre').notEmpty().withMessage('El nombre completo es obligatorio'),
        body('codigo_postal')
            .isPostalCode('ES') 
            .withMessage('El código postal no es válido'),
        body('telefono')
            .matches(/^[0-9]{9}$/)
            .withMessage('El teléfono debe tener 9 dígitos'),
        body('dni')
            .matches(/^[0-9]{8}[A-Za-z]$/)
            .withMessage('El DNI debe tener 8 números seguidos de una letra'),
        body('puntoId').notEmpty().withMessage('Debes seleccionar un punto de recogida'),
    ],
    autenticado('/usuarios/login'),crearPuntoRecogida);


envioRouter.post('/formEnvioProducto/:id', 
    [
        autenticado('/usuarios/login'),
        body('nombre').notEmpty().withMessage('El nombre completo es obligatorio'),
        body('codigo_postal')
            .isPostalCode('ES') 
            .withMessage('El código postal no es válido'),
        body('telefono')
            .matches(/^[0-9]{9}$/)
            .withMessage('El teléfono debe tener 9 dígitos'),
        body('dni')
            .matches(/^[0-9]{8}[A-Za-z]$/)
            .withMessage('El DNI debe tener 8 números seguidos de una letra'),
        body('direccion_entrega').notEmpty().withMessage('La dirección de entrega es obligatoria'),
    ],
    crearDireccion);
envioRouter.get('/formTarjeta/:id', autenticado('/usuarios/login'),formularioTarjeta);
envioRouter.post(
    '/formTarjeta/:id',
    [
        body('nombre_titular').notEmpty().withMessage('El nombre del titular es obligatorio'),
        body('numero_tarjeta').isLength({ min: 16, max: 16 }).withMessage('El número de tarjeta debe tener 16 dígitos'),
        body('fecha_expiracion')
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
        .withMessage('La fecha de expiración debe estar en el formato MM/AA'),
        body('codigo_seguridad').isLength({ min: 3, max: 3 }).withMessage('El código de seguridad debe tener 3 dígitos'),
    ],
    crearTarjeta
);

envioRouter.post('/confirmacionCompra/:id', autenticado('/usuarios/login'), confirmacionCompra);

envioRouter.get('/confirmacionCompra/:id', autenticado('/usuarios/login'), mostrarTicket);

envioRouter.get('/resumenCompras', autenticado('/usuarios/login'), mostarHistorial);



export default envioRouter;




