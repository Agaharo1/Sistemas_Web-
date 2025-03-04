import { body } from 'express-validator';
import { Usuario,RolesEnum } from './Usuario.js';

export function viewLogin(req, res) {
    const params = {
        contenido: 'paginas/usuario/login',
        session: req.session
    }
    res.render('pagina', params)
}

export function viewRegister(req, res) {
    const params = {
        contenido: 'paginas/usuario/registro',
        session: req.session
    }
    res.render('pagina', params)
}

export function doRegister(req, res) {
    const {nombre, username, password} = req.body;
    try{
    const result = Usuario.crearUsuario(username, password, nombre); //nuestro username es el correo electronico
    res.redirect('/usuarios/login');
    } catch(e) {
        res.status(400).send(e.message);
    }
    

}

export function doLogin(req, res) {
    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
    
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const usuario = Usuario.login(username, password);
        req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;
        console.log(`Usuario logueado: ${username}`);
        return res.render('pagina', {
            contenido: 'paginas/index',
            session: req.session
        });

    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/usuario/login',
            error: 'El usuario o contraseña no son válidos',
            userErr : username
        })
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
