import express from 'express';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister, viewBaja, doBaja } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
const usuariosRouter = express.Router();

//Pagina de login
usuariosRouter.get('/login', viewLogin);

//Pagina de registro
usuariosRouter.get('/registro', viewRegister);

//Registro de un usuario
//usuariosRouter.post('/registro', doRegister)

usuariosRouter.post('/registro'
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('nombre', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 })
    , body('passwordConfirmacion', 'La contraseña no coincide').custom((value, { req }) => {
        return value === req.body.password;
    })
    , doRegister);

//Dar de baja un usuario
usuariosRouter.get('/baja', viewBaja);
usuariosRouter.post('/baja', doBaja,doLogout);

//Procesar login
//usuariosRouter.post('/login', doLogin);
usuariosRouter.post('/login', autenticado(null, '/usuarios/home')
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'No puede ser vacío').trim().notEmpty()
    , doLogin);

//Procesar logout
usuariosRouter.get('/logout', doLogout);



export default usuariosRouter;