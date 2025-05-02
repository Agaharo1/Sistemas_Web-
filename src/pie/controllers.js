import session from "express-session";


export function sobreNosotros(req, res) {

    res.render("pagina", {
        contenido: "paginas/pie/sobreNosotros",
        session: req.session}
    );
}
export function contacto(req, res) {

    res.render("pagina", {
        contenido: "paginas/pie/contacto",
        session: req.session}
    );
}
export function terminosCondiciones(req, res) {

    res.render("pagina", {
        contenido: "paginas/pie/terminosCondiciones",
        session: req.session}
    );
}
export function politicaPrivacidad(req, res) {

    res.render("pagina", {
        contenido: "paginas/pie/politicaPrivacidad",
        session: req.session}
    );
}