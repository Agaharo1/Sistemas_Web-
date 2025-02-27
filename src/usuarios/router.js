import express from 'express';
import { viewLogin, doLogin, doLogout } from './controllers.js';

const usuariosRouter = express.Router();

//Pagina de login
usuariosRouter.get('/login', viewLogin);

//Procesar login
usuariosRouter.post('/login', doLogin);

//Procesar logout
usuariosRouter.get('/logout', doLogout);

export default usuariosRouter;