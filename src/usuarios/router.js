import express from 'express';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister } from './controllers.js';

const usuariosRouter = express.Router();

//Pagina de login
usuariosRouter.get('/login', viewLogin);

//Pagina de registro
usuariosRouter.get('/registro', viewRegister);

//Registro de un usuario
usuariosRouter.post('/registro', doRegister)

//Procesar login
usuariosRouter.post('/login', doLogin);

//Procesar logout
usuariosRouter.get('/logout', doLogout);



export default usuariosRouter;