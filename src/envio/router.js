import express from 'express';

import { config } from '../config.js';
import { eliminarDireccion,eliminarTarjeta,editarDireccion,mostrarTarjetas,formularioPuntoRecogida,formularioEnvioProducto,envioProducto,mostarHistorial,formularioTarjeta,mostrarHisVentas,mostrarTicket,crearDireccion,crearPuntoRecogida,crearTarjeta,confirmacionCompra} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 
import { body } from 'express-validator';

const envioRouter = express.Router();

//Gets
envioRouter.get('/formPuntoRecogida/:id', autenticado('/usuarios/login'), formularioPuntoRecogida);
envioRouter.get('/formEnvioProducto/:id', autenticado('/usuarios/login'), formularioEnvioProducto);
envioRouter.get('/editarDireccion/:id', autenticado('/usuarios/login'), editarDireccion);
envioRouter.get('/resumenProducto/:id', autenticado('/usuarios/login'), envioProducto); 
envioRouter.get('/formTarjeta/:id', autenticado('/usuarios/login'),formularioTarjeta);
envioRouter.get('/deleteformTarjeta/:id', autenticado('/usuarios/login'), mostrarTarjetas);
envioRouter.get('/confirmacionCompra/:id', autenticado('/usuarios/login'), mostrarTicket);
envioRouter.get('/resumenCompras', autenticado('/usuarios/login'), mostarHistorial);
envioRouter.get('/resumenVentas', autenticado('/usuarios/login'), mostrarHisVentas);

//Posts
envioRouter.post('/confirmacionCompra/:id', autenticado('/usuarios/login'), confirmacionCompra);
envioRouter.post('/deleteformTarjeta/:id', autenticado('/usuarios/login'), eliminarTarjeta);
envioRouter.post('/editarDireccion/:id',autenticado('/usuarios/login'), eliminarDireccion);
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



export default envioRouter;




