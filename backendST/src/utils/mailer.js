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

// Dos formas de mandar correo, segun donde corra el servidor:
//
//  - Con BREVO_API_KEY (produccion): API de Brevo por HTTPS. Es necesaria
//    porque Render (plan gratuito) bloquea los puertos SMTP 25/465/587 desde
//    el 26/09/2025, asi que Gmail por SMTP simplemente no sale. El remitente
//    (USER_EMAIL) debe estar verificado como "remitente" en Brevo.
//  - Sin esa variable (local): Gmail por SMTP con nodemailer, como siempre.
const useBrevo = () => !!process.env.BREVO_API_KEY;

if (useBrevo()) {
  console.log('[Mailer] Usando la API de Brevo. Remitente:', process.env.USER_EMAIL);
} else {
  // Verify connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('[Mailer] Connection failed:', error.message);
    } else {
      console.log('[Mailer] Ready to send emails as:', process.env.USER_EMAIL);
    }
  });
}

const sendMail = async ({ to, subject, html }) => {
  if (useBrevo()) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Street Flex', email: process.env.USER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      throw new Error(`Brevo respondio ${res.status}: ${await res.text()}`);
    }
    return;
  }

  await transporter.sendMail({ from: `"Street Flex" <${process.env.USER_EMAIL}>`, to, subject, html });
};

// `code` es el de 6 digitos que se tipea en la app movil; `token` sigue
// siendo el link que usa la pantalla de verificacion de la web
// (frontend/src/screens/web/VerifyEmailScreen.jsx) — se manda un solo correo
// con las dos formas de verificar para no tener que tocar esa pantalla.
export const sendVerificationEmail = async (email, { token, code }) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${token}`;

  const mailOptions = {
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

  await sendMail(mailOptions);
  console.log('[Mailer] Verification email sent to:', email);
};

// `code` es el de 6 digitos que se escribe en la app movil; `token` es el link
// que usa la pantalla de la web (ResetPasswordScreen). Un solo correo con las
// dos formas de recuperar, igual que el de verificacion.
export const sendPasswordResetEmail = async (email, { token, code }) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

  const mailOptions = {
    to: email,
    subject: 'Recuperación de contraseña - Street Flex',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 20px; text-align: center; background-color: #000; color: #fff;">
        <h1 style="text-transform: uppercase; letter-spacing: 2px;">Recuperación de Contraseña</h1>
        <p style="font-size: 16px; font-weight: 300;">Recibimos una solicitud para restablecer tu contraseña. Ingresa este código en la app:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 24px 0; font-family: monospace;">${code}</div>
        <p style="font-size: 13px; color: #aaa;">Vence en 15 minutos.</p>
        <p style="font-size: 14px; color: #ccc; margin-top: 24px;">Si estás en la computadora, también puedes <a href="${resetUrl}" style="color: #fff;">restablecerla con este enlace</a>.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">Si no solicitaste esto, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await sendMail(mailOptions);
  console.log('[Mailer] Password reset email sent to:', email);
};
