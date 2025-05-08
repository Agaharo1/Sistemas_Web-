import express from 'express';

import { config } from '../config.js';
import {sobreNosotros,contacto,terminosCondiciones,politicaPrivacidad,mandarCorreo} from './controllers.js';
import { body } from 'express-validator';

const pieRouter = express.Router();

pieRouter.get('/sobreNosotros',sobreNosotros);
pieRouter.get('/contacto',contacto);
pieRouter.get('/terminosCondiciones',terminosCondiciones);
pieRouter.get('/politicaPrivacidad',politicaPrivacidad);
pieRouter.post('/contacto',mandarCorreo);




export default pieRouter;




