import { validationResult, matchedData } from 'express-validator';
import { socketConnectionRequest, broadcastMessage } from '../sse/utils.js';


export function listNotificaciones(req, res) {
    const result = validationResult(req);
    const datos = matchedData(req, { includeOptionals: true });
    if (! result.isEmpty()) {
        const errores = result.array();
        return res.status(400).json({ status: 400, errores });
    }
    socketConnectionRequest(req, res, datos.categoria);
    sseRandom(req, res);
}

// SSE random number
function sseRandom(req, res) {
    broadcastMessage(Math.floor(Math.random() * 1000) + 1);
    setTimeout(() => sseRandom(req, res), Math.random() * 3000);
}