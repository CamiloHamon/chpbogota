// Importar nodemailer
import nodemailer from 'nodemailer';

// Configurar el transporte de nodemailer
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico de Gmail
    pass: process.env.EMAIL_PASS, // Tu Contraseña de Aplicación de Gmail
  },
});
