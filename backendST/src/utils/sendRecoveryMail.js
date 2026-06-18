// #1 Retorna el template HTML para el correo de recuperación
const HTMLRecoveryEmail = (code) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recupera tu Contraseña | Élaris de Élite</title>
      <style>
        /* Tipografías y reseteos para asegurar compatibilidad */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600&display=swap');
        
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #fcf9f6; }

        /* Estilos Responsivos */
        @media screen and (max-width: 600px) {
          .email-container { width: 100% !important; padding: 10px !important; }
          .fluid-padding { padding: 20px !important; }
          .brand-title { font-size: 28px !important; }
          .code-box { font-size: 32px !important; letter-spacing: 6px !important; padding: 15px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fcf9f6; font-family: 'Montserrat', sans-serif;">

      <!-- Contenedor Principal (Fondo) -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcf9f6; table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            
            <!-- Tarjeta del Correo -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.08); border: 1px solid #f3e9df;">
              
              <!-- Encabezado / Logo Estilo Élaris de Élite -->
              <tr>
                <td align="center" style="background-color: #f7ebe1; padding: 35px 20px; border-bottom: 1px solid #ebdcd0;">
                  <div style="border: 2px solid #c5a880; display: inline-block; padding: 5px 25px; border-radius: 50px;">
                    <h1 class="brand-title" style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; color: #78593e; margin: 0; letter-spacing: 4px; text-transform: uppercase;">
                      Élaris de Élite
                    </h1>
                  </div>
                  <p style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: #a3846b; margin: 8px 0 0 0; letter-spacing: 2px;">
                    Tu poder, tu belleza
                  </p>
                </td>
              </tr>

              <!-- Cuerpo del Mensaje -->
              <tr>
                <td class="fluid-padding" style="padding: 50px 40px; align-content: center; text-align: center;">
                  
                  <h2 style="font-family: 'Playfair Display', serif; font-size: 26px; color: #4a3728; font-weight: 400; margin-0-0-20px: 0 0 20px 0; letter-spacing: 1px;">
                    ¿Olvidaste tu contraseña?
                  </h2>
                  
                  <p style="font-size: 15px; line-height: 1.8; color: #6e5d53; margin: 0 0 30px 0; font-weight: 300;">
                    No te preocupes, un tropiezo lo tiene cualquiera. Para volver a acceder a tu universo de belleza exclusivo, utiliza el siguiente código de verificación de un solo uso.
                  </p>

                  <!-- Caja del Código-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                    <tr>
                      <td align="center">
                        <div class="code-box" style="background-color: #fcf9f6; border: 2px dashed #c5a880; color: #78593e; font-family: 'Playfair Display', serif; font-size: 40px; font-weight: bold; letter-spacing: 10px; padding: 20px 40px; border-radius: 12px; display: inline-block; box-shadow: inset 0 0 10px rgba(197,168,128,0.1);">
                          ${code}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 13px; line-height: 1.6; color: #a3846b; margin: 0 0 10px 0; font-style: italic;">
                    Este código expirará en los próximos 15 minutos por tu seguridad.
                  </p>
                  
                  <p style="font-size: 13px; line-height: 1.6; color: #bdaf9e; margin: 0;">
                    Si tú no has solicitado este cambio, puedes ignorar este correo de forma segura.
                  </p>

                </td>
              </tr>

              <!-- Separador visual de lujo -->
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <div style="height: 1px; width: 100%; background-color: #f3e9df;"></div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fbe6e6; padding: 35px 40px; text-align: center;">
                  
                  <!-- Enlaces Rápidos Simulados -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                    <tr>
                      <td align="center" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">
                        <a href="#" style="color: #d18b8b; text-decoration: none; margin: 0 10px;">Productos</a>
                        <span style="color: #e0b4b4;">•</span>
                        <a href="#" style="color: #d18b8b; text-decoration: none; margin: 0 10px;">Novedades</a>
                        <span style="color: #e0b4b4;">•</span>
                        <a href="#" style="color: #d18b8b; text-decoration: none; margin: 0 10px;">Nosotros</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Marca en el Footer -->
                  <p style="font-family: 'Playfair Display', serif; font-size: 18px; color: #d18b8b; margin: 0 0 15px 0; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">
                    Élaris de Élite
                  </p>

                  <!-- Iconos de Redes Sociales (Texto estilizado para evitar imágenes caídas) -->
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 0 8px;"><a href="#" style="color: #d18b8b; text-decoration: none; font-size: 16px; font-weight: bold;">𝕏</a></td>
                      <td style="padding: 0 8px;"><a href="#" style="color: #d18b8b; text-decoration: none; font-size: 18px; font-weight: bold;">f</a></td>
                      <td style="padding: 0 8px;"><a href="#" style="color: #d18b8b; text-decoration: none; font-size: 18px; font-weight: bold;">📸</a></td>
                    </tr>
                  </table>

                  <!-- Derechos Reservados -->
                  <p style="font-size: 11px; color: #d18b8b; margin: 0; letter-spacing: 0.5px; opacity: 0.8;">
                    © 2026 Élaris de Élite. Todos los derechos reservados.
                  </p>
                  
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};

export default HTMLRecoveryEmail;