import { logger } from '../logger.js';

// https://www.sitepoint.com/server-sent-events-node-js/
// https://medium.com/@ajinkya.r.rajput/real-time-push-messages-from-server-server-sent-event-in-node-js-with-express-js-redis-5fd3843ee0fa
// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events

let categorias = new Map();

export function socketConnectionRequest(req, res, categoria = 'global') {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };
    res.writeHead(200, headers);

    const socketId = Symbol(Date.now())

    const socket = {
        socketId,
        res,
        rol: req.usuario.rol,
        usuario: req.usuario.userId,
    }

    logger.debug(`New connection established for user id=%s of connection Id=%s`, req.usuario.userId, socketId);
    //logger.debug(`New connection established: %s`, socketId);
    publishMessage(socket, 'Connection Established, We\'ll now start receiving messages from the server.');

    let sockets = categorias.get(categoria);
    if (sockets == undefined) {
        sockets = [];
        categorias.set(categoria, sockets);
    }
    sockets.push(socket);
    req.on('close', function () {
        logger.debug(`Connection closed: %s`, socketId);
        let sockets = categorias.get(categoria);
        sockets = sockets.filter((socket) => socket.socketId !== socketId);
        categorias.set(categoria, sockets);
    })
}

function publishMessage(socket, data, { event = null, id = null, retry = null, rol = null, usuario = null } = {}) {
    if ((rol != null && socket.rol !== rol) || (usuario != null && socket.usuario !== usuario)) {
        return;
    }

    const { res } = socket
    const eventClause = event == null ? '' : `event: ${event}\n`;
    const retryClause = retry == null ? '' : `retry: ${retry}\n`;
    const idClause = id == null ? '' : `id: ${id}\n`;
    res.write(`${eventClause}${retryClause}data: ${data}${idClause}\n\n`);
}

export function broadcastMessage(data, {categoria = 'global', ...opciones } = {}) {
    let sockets = categorias.get(categoria);
    if (sockets == undefined) return;

    sockets.forEach((socket) => {
        publishMessage(socket, data, {categoria, ...opciones});
    });
}