import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    // Timeout settings (in ms) to avoid hanging connections
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

// Log env var presence (mask actual values for security)
console.log('🔧 EMAIL_USER set:', !!process.env.EMAIL_USER);
console.log('🔧 EMAIL_PASS set:', !!process.env.EMAIL_PASS);

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

export const sendNewsletterEmail = async (bccList: string[], subject: string, content: string) => {
    try {
        const mailOptions = {
            from: '"Novedades Floyd Style" <no-reply@concepthab.com>',
            bcc: bccList,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">${subject}</h2>
                    
                    <div style="font-size: 16px; line-height: 1.6; padding: 20px 0;">
                        ${content.replace(/\n/g, '<br>')} 
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    
                    <small style="color: #777; display: block; text-align: center; margin-top: 20px;">
                        Recibiste este correo porque te suscribiste a nuestro newsletter.<br>
                        Si deseas darte de baja, contacta con soporte.
                    </small>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Newsletter enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando newsletter:', error);
        throw new Error('No se pudo enviar el newsletter.');
    }
};