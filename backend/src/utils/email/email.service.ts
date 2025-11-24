import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

export const sendResetEmail = async (to: string, resetLink: string) => {
    try {
        const mailOptions = {
            from: '"Soporte Concept & Hab" <no-reply@concepthab.com>',
            to: to,
            subject: 'Recuperación de Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #000;">Recupera tu acceso</h2>
                    <p>Has solicitado restablecer tu contraseña en Concept & Hab.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Restablecer Contraseña</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste este cambio, ignora este correo. El enlace expirará en 1 hora.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        throw new Error('No se pudo enviar el correo de recuperación.');
    }
};