// controllers/contactController.js

import ContactUs from '../models/contactUs.model.js';

export const saveMessage = async (req, res) => {
  try {
    const { subject, message, userName, email } = req.body;

    // Crear una nueva instancia del modelo ContactUs
    const newMessage = new ContactUs({
      subject,
      message,
      userName,
      email,
    });

    // Guardar el mensaje en la base de datos
    await newMessage.save();

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
        message: 'Validation Error',
        errors: error.errors,
      });
    }

    // Manejar otros errores
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
