import express from 'express';
import { viewImagen } from './controller.js';
const imagenRouter = express.Router();

imagenRouter.get("/imagen/:id/:img", viewImagen);

export default  imagenRouter ;