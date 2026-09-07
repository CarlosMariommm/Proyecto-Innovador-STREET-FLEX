import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[Mailer] Connection failed:', error.message);
  } else {
    console.log('[Mailer] Ready to send emails as:', process.env.USER_EMAIL);
  }
});

// `code` es el de 6 digitos que se tipea en la app movil; `token` sigue
// siendo el link que usa la pantalla de verificacion de la web
// (frontend/src/screens/web/VerifyEmailScreen.jsx) — se manda un solo correo
// con las dos formas de verificar para no tener que tocar esa pantalla.
export const sendVerificationEmail = async (email, { token, code }) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${token}`;

  const mailOptions = {
    from: `"Street Flex" <${process.env.USER_EMAIL}>`,
    to: email,
    subject: 'Tu codigo de verificacion - Street Flex',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 20px; text-align: center; background-color: #000; color: #fff;">
        <h1 style="text-transform: uppercase; letter-spacing: 2px;">Bienvenido a Street Flex</h1>
        <p style="font-size: 16px; font-weight: 300;">Gracias por registrarte. Ingresa este codigo en la app para verificar tu cuenta:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 24px 0; font-family: monospace;">${code}</div>
        <p style="font-size: 13px; color: #aaa;">Vence en 15 minutos.</p>
        <p style="font-size: 14px; color: #ccc; margin-top: 24px;">Si estas en la computadora, tambien puedes <a href="${verifyUrl}" style="color: #fff;">verificar con este enlace</a>.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('[Mailer] Verification email sent to:', email);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"Street Flex" <${process.env.USER_EMAIL}>`,
    to: email,
    subject: 'Recuperación de contraseña - Street Flex',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 20px; text-align: center; background-color: #000; color: #fff;">
        <h1 style="text-transform: uppercase; letter-spacing: 2px;">Recuperación de Contraseña</h1>
        <p style="font-size: 16px; font-weight: 300;">Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón para continuar:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #fff; color: #000; text-decoration: none; font-weight: bold; font-family: monospace;">RESTABLECER CONTRASEÑA</a>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">Si no solicitaste esto, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('[Mailer] Password reset email sent to:', email);
};
