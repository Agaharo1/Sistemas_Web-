import express from 'express';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister, viewBaja, doBaja, viewHome, viewProfile, viewEditarPerfil, doEditarPerfil } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
const usuariosRouter = express.Router();

//Pagina de login
usuariosRouter.get('/login', autenticado(null, '/usuarios/index'), viewLogin);

//Pagina de registro
usuariosRouter.get('/registro', viewRegister);

//Perfil del usuario
usuariosRouter.get('/profile',autenticado('/usuarios/login'), viewProfile);

//Edicion perfil del usuario
usuariosRouter.get('/editarPerfil', autenticado('/usuarios/login'),viewEditarPerfil);

usuariosRouter.post('/editarPerfil', 
    body('username', 'No puede ser vacío').trim().notEmpty()
    , body('nombre', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 })
    , body('passwordConfirmacion', 'La contraseña no coincide').custom((value, { req }) => {
        return value === req.body.password;
    }),
    asyncHandler(doEditarPerfil));

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
usuariosRouter.post('/login', autenticado(null, '/usuarios/index')
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'No puede ser vacío').trim().notEmpty()
    , doLogin);

//Procesar logout
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/index', autenticado('/usuarios/index'), viewHome);

export default usuariosRouter;