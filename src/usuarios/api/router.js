import express from 'express';
import { query, body } from 'express-validator';
import { listUsuarios, checkUsername,checkUsernameEditar } from './controllers.js';
import asyncHandler from 'express-async-handler';

const usuariosApiRouter = express.Router();

usuariosApiRouter.get('/'
    , query('pagina').optional().isInt()
    , asyncHandler(listUsuarios));

usuariosApiRouter.post('/disponible'
    , body('username', 'Falta el username')
    , asyncHandler(checkUsername));
    
usuariosApiRouter.post('/disponibleEditar'
    , body('username', 'Falta el username')
    , asyncHandler(checkUsernameEditar));
    
export default usuariosApiRouter;