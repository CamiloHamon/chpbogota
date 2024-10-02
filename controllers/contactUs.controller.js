import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import ContactUs from '../models/contactUs.model.js'; // Asegúrate de importar el modelo correcto
import { transporter } from '../config/nodemailer.js';

// Cargar las credenciales de Google desde el archivo JSON
const recaptchaClient = new RecaptchaEnterpriseServiceClient({
  credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString())
});

async function validateRecaptchaEnterprise(recaptchaToken, projectID, recaptchaKey) {
  try {
    const projectPath = recaptchaClient.projectPath(projectID);

    const request = {
      assessment: {
        event: {
          token: recaptchaToken,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await recaptchaClient.createAssessment(request);

    // Verificar si el token es válido
    if (!response.tokenProperties.valid) {
      console.error(`Token inválido: ${response.tokenProperties.invalidReason}`);
      return false;
    }

    // Verificar la acción esperada
    if (response.tokenProperties.action !== 'LOGIN') { // Ajusta la acción según tu caso
      console.error('La acción del token no coincide con la esperada.');
      return false;
    }

    // Verificar la puntuación de riesgo (0.0 a 1.0, donde 1.0 es muy confiable)
    return response.riskAnalysis.score >= 0.5; // Aquí puedes ajustar el umbral de riesgo
  } catch (error) {
    console.error('Error en la validación de reCAPTCHA Enterprise:', error);
    return false;
  }
}

export const saveMessage = async (req, res) => {
  try {
    const { subject, message, userName, email, recaptchaToken } = req.body;
    const projectID = process.env.GOOGLE_PROJECT_ID;
    const recaptchaKey = process.env.GOOGLE_RECAPTCHA_KEY;

    // Validar reCAPTCHA Enterprise
    const isRecaptchaValid = await validateRecaptchaEnterprise(recaptchaToken, projectID, recaptchaKey);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'Error en la verificación del reCAPTCHA.',
      });
    }

    // Crear una nueva instancia del modelo ContactUs
    const newMessage = new ContactUs({
      subject,
      message,
      userName,
      email,
    });

    // Guardar el mensaje en la base de datos
    await newMessage.save();

    // Configurar el correo electrónico
    const mailOptions = {
      to: process.env.TO_EMAIL_USER,
      from: process.env.TO_EMAIL_USER,
      subject: 'Nuevo Mensaje de Contacto desde la Página Web',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #761537;">Tienes un nuevo mensaje de contacto</h2>
        <p>Estimado administrador,</p>
        <p>Una persona ha enviado un mensaje a través del formulario de contacto de tu página web:</p>
        <hr>
        <p><strong>Nombre:</strong> ${userName}</p>
        <p><strong>Correo electrónico:</strong> <a href="mailto:${email}" style="color: #0044cc;">${email}</a></p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote style="background-color: #f9f9f9; border-left: 4px solid #ddd; margin: 10px 0; padding: 10px;">
          ${message}
        </blockquote>
        <hr>
        <p style="font-size: 0.9em;">Este mensaje fue enviado desde el formulario de contacto de la página web del Colegio de Administradores de Propiedad Horizontal de Bogotá D.C.</p>
        <p style="font-size: 0.9em; color: #555;">Si tienes alguna duda o necesitas más información, por favor contacta con nosotros a través de <a href="mailto:colegiophbogota@gmail.com" style="color: #0044cc;">colegiophbogota@gmail.com</a>.</p>
      </div>`,
    };

    await transporter.sendMail(mailOptions);
    // Enviar una respuesta de éxito
    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    // Manejar errores de validación
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: error.errors,
      });
    }

    // Manejar otros errores
    res.status(500).json({
      success: false,
      message: 'Error del servidor. Inténtalo más tarde.',
    });
  }
};
