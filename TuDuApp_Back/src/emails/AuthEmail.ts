import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : IEmail) => {
        const info = await transporter.sendMail({
            from: 'TuDu <admin@tudu.com>',
            to: user.email,
            subject: 'TuDu - Confirma tu cuenta',
            text: 'Utiliza el siguiente código para confirmar tu cuenta:',
            html: `<p>Hola: ${user.name}, ya casi has creado tu cuenta en TuDu, solo falta confirmar tu cuenta. Para ello copia el siguiente código y visita el enlace:</p>
                <p>Código: <b>${user.token}</b></p>
                <a href=""> Confirmar cuenta</a>
                <p>El código expirará en 10 minutos.</p>
            `
        })
        console.log('Mensaje enviado', info.messageId)
    }
}