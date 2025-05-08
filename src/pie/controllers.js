import session from "express-session";
import nodemailer from 'nodemailer';

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

export async function mandarCorreo(req, res) {
    const { nombre, email, mensaje } = req.body;

    try {
      
        const transporter = nodemailer.createTransport({
            host: 'mail.swarm.test', 
            port: 25,              
            secure: false         
        });

       
        const mailOptions = {
            from: `"${nombre}" <${email}>`, 
            to: 'usuario@containers.fdi.ucm.es', 
            subject: 'Nuevo mensaje de contacto',
            text: `
                Nombre: ${nombre}
                Email: ${email}
                Mensaje:
                ${mensaje}
            `
        };

        
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: ' + info.response);

        
        res.redirect('/?success=true');
    } catch (error) {
        console.error('Error al enviar el correo:', error);

        
        res.redirect('/?success=false');
    }
}