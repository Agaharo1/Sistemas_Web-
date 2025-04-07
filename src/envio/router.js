import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { formularioPuntoRecogida,formularioEnvioProducto,envioProducto,formularioTarjeta,crearDireccion,crearTarjeta,confirmacionCompra,agradecimiento} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 

const envioRouter = express.Router();
const multerFactory = multer({ dest: config.uploads });

envioRouter.get('/formPuntoRecogida/:id', autenticado('/usuarios/login'), formularioPuntoRecogida);
envioRouter.get('/formEnvioProducto/:id', autenticado('/usuarios/login'), formularioEnvioProducto);
envioRouter.get('/resumenProducto/:id', autenticado('/usuarios/login'), envioProducto); 
envioRouter.post('/formPuntoRecogida/:id', autenticado('/usuarios/login'),crearDireccion);
envioRouter.post('/formEnvioProducto/:id', autenticado('/usuarios/login'), crearDireccion);
envioRouter.get('/formTarjeta/:id', autenticado('/usuarios/login'), formularioTarjeta);
envioRouter.post('/formTarjeta/:id', autenticado('/usuarios/login'), crearTarjeta);

envioRouter.post('/confirmacionCompra/:id', autenticado('/usuarios/login'), confirmacionCompra);
envioRouter.get('/agradecimiento', autenticado('/usuarios/login'), agradecimiento);


export default envioRouter;