import express from 'express';
import multer from 'multer';
import { config } from '../config.js';
import { formularioPuntoRecogida} from './controllers.js';
import { autenticado } from '../middleware/auth.js'; 

const envioRouter = express.Router();
const multerFactory = multer({ dest: config.uploads });

envioRouter.get('/formPuntoRecogida', autenticado('/usuarios/login'), formularioPuntoRecogida);

export default envioRouter;