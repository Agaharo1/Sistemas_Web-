import { join } from 'path';
import { config } from '../config.js';
import path from 'path';

export function viewImagen(req, res) {
    const { id, img } = req.params;
    const cleanId = parseInt(id, 10);
    const imagePath = join(config.uploads, String(cleanId), img);
    res.sendFile(imagePath);
}