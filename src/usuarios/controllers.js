import { body } from 'express-validator';

export function viewLogin(req, res) {
    const params = {
        contenido: './paginas/usuario/login',
        session: req.session
    }
    res.render('pagina', params)
}

export function doLogin(req, res) {
    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
    
    const { username, password } = req.body;

    if (username === 'user' && password === 'userpass') {
        req.session.nombre = "Usuario";
        req.session.login = true;
        req.session.usuario = "Usuario";
        req.session.esAdmin = false;
        res.redirect('/contenido/vlogin');
    } else if (username === "admin" && password === "adminpass") {
        req.session.nombre = "Administrador";
        req.session.login = true;
        req.session.usuario = "Administrador";
        req.session.esAdmin = true;
        return res.redirect('/contenido/vlogin');
    }
    else{
        return res.redirect('/contenido/flogin');
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
