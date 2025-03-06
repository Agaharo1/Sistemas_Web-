import { join } from 'path';
import { config } from '../config.js';
import path from 'path';

export function viewImagen(req, res) {
    const { id, img } = req.params;
    const imagePath = path.join(config.uploads, id, img);
    res.sendFile(imagePath);
}