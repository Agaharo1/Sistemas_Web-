
import { Usuario,RolesEnum } from './Usuario.js';
import { render } from '../utils/render.js';
import { logger } from '../logger.js';
import { body, validationResult, matchedData } from 'express-validator';

export function viewLogin(req, res) {
    render(req, res, 'paginas/usuario/login', {
        datos: {},
        errores: {}
    });
}

export function viewRegister(req, res) {
   
    render(req, res, 'paginas/usuario/registro', {
        datos: {},
        errores: {}
    });
}

export async function doRegister(req, res) {

    const result = validationResult(req);
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/usuario/registro', {
            datos,
            errores
        });
    }



    const {nombre, username, password} = req.body;
    try{
    const result = await Usuario.crearUsuario(username, password, nombre); //nuestro username es el correo electronico
    res.redirect('/usuarios/login');
    } catch(e) {
          // Log de nivel error
        logger.error('Error en el proceso de registro.');

          // Log de nivel debug con detalles de la excepción
        logger.debug(`Detalles del error en registro: ${e.message}`);

        render(req, res, 'paginas/usuario/registro', {
            error: 'No se ha podido crear el usuario',
            datos: {},
            errores: {}
        });
    }
    

}

export function viewBaja(req, res) {
    const params = {
        contenido: 'paginas/usuario/baja',
        session: req.session
    }
    res.render('pagina', params)
}

export function doBaja(req, res,next) {
    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
    
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const usuario = Usuario.eliminarUsuario(username, password);
        console.log(`Usuario dado de baja: ${username}`);
        next();

    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/usuario/baja',
            error: 'Contraseña erronea',
            userErr : username,
            session: req.session
        })
    }
}



export async function doLogin(req, res) {
    const result = validationResult(req);
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/usuario/login', {
            errores,
            datos,
            session: req.session
        });
    }

    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
    
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const usuario = await Usuario.login(username, password);
        req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;
        console.log(`Usuario logueado: ${username}`);
        req.session.user_id = usuario.id;
        return res.render('pagina', {
            contenido: 'paginas/index',
            session: req.session
        });

    } catch (e) {

        const datos = matchedData(req);
        req.log.warn("Problemas al hacer login del usuario '%s'", username);
        req.log.debug('El usuario %s, no ha podido logarse: %s', username, e.message);
        render(req, res, 'paginas/usuario/login', {
            error: 'El usuario o contraseña no son válidos',
            datos,
            errores: {}
        });
    }
}

export function doLogout(req, res) {
    if (req.session) {
        delete req.session.login;
        delete req.session.username;
        delete req.session.esAdmin;

        // Renderizar página de despedida
        res.render('pagina', { 
            contenido: './paginas/usuario/logout',
            session: req.session
        });
    } else {
        res.redirect('/');
    }
    
}

