import { validationResult, matchedData } from 'express-validator';
import { Usuario } from '../Usuario.js';
import { pick } from 'lodash-es';

export async function listUsuarios(req, res) {
    const result = validationResult(req);
    const datos = matchedData(req, { includeOptionals: true });
    if (! result.isEmpty()) {
        const errores = result.array();
        return res.status(400).json({ status: 400, errores });
    }
    // Capturo las variables username y password
    let pagina = datos.pagina || 1;
    pagina -= 1;

    const por_pagina = 6;
    const usuarios = Usuario.listUsuarios(pagina, por_pagina);
    const data = usuarios.map((usuario) => pick(usuario, ['id', 'username', 'nombre', 'apellidos', 'email', 'rol', 'avatar']));
    const total = Usuario.countUsuarios();
    const total_paginas = Math.trunc(total / por_pagina) + (total % por_pagina != 0 ? 1 : 0);

    return res.status(200).json({
        pagina: pagina + 1,
        por_pagina,
        total,
        total_paginas,
        data
    });
}

export async function checkUsername(req, res) {
    const result = validationResult(req);
    const datos = matchedData(req, { includeOptionals: true });
    if (! result.isEmpty()) {
        const errores = result.array();
        return res.status(400).json({ status: 400, errores });
    }
    const { username } = datos;
    const disponible = ! Usuario.existeUsername(username);

    return res.status(200).json(disponible);
}