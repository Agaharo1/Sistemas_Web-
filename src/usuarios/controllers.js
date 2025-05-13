
import { Usuario,RolesEnum } from './Usuario.js';
import { render } from '../utils/render.js';
import { logger } from '../logger.js';
import { body, validationResult, matchedData } from 'express-validator';
import { redirige } from '../middleware/utils.js';
import { Producto } from '../productos/Productos.js';

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

export function viewProfile(req, res) {
    let productos = [];
    if (req.session.login) {
            productos = Producto.getProductByUserId(req.session.user_id);   
    }
    render(req, res, 'pagina', {
        contenido: 'paginas/contenido/misProductos',
        session: req.session,
        esPerfil: true,
        productos: productos,
        datos: {},
        errores: {}
    });
}

export function viewEditarPerfil(req, res) {
    const id = parseInt(req.session.user_id);
    if (isNaN(id)) {    
        return redirige(req, res, '/usuarios/login');
    }
    const usuario = Usuario.getUsuarioById(id);
    const params = {
        contenido: "paginas/usuario/editarPerfil",
        usuario,
        session: req.session
    };
    res.render("pagina", params);
}

export function doEditarPerfil(req, res) {
    const userId = parseInt(req.session.user_id);
    const {nombre, username, password } = req.body;
    try {
        console.log("Editando perfil:", userId, nombre, username, password);
        Usuario.editarPerfil(nombre, username, password, userId);
        res.redirect("/contenido/normal");
    } catch (e) {
        res.status(400).send(e.message);
    }
}

export async function doRegister(req, res) {

    const result = validationResult(req);
    const datos = matchedData(req);
    
    const requestWith = req.get('X-Requested-With');
    const esAjax = requestWith != undefined && ['xmlhttprequest', 'fetch'].includes(requestWith.toLowerCase());

    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        if (esAjax) {
            return res.status(400).json({ status: 400, errores });
        }
        return render(req, res, 'paginas/usuario/registro', {
            datos,
            errores
        });
    }



    const {nombre, username, password} = datos;
    
    try{
        const result = await Usuario.crearUsuario(username, password, nombre); //nuestro username es el correo electronico
        req.session.login = true;
        req.session.nombre = nombre;
        req.session.esAdmin = result.rol === RolesEnum.ADMIN;
        req.session.user_id = result.id;

         if (esAjax) {
            return res.status(200).json({ ok: true });
        }
        
        return res.redirect('/usuarios/index');
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
        req.log.debug(`Usuario logueado: ${username}`);
        req.session.user_id = usuario.id;
        return res.redirect('/usuarios/profile');
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
export function viewHome(req, res) {
    return res.redirect('/contenido/normal');
}
