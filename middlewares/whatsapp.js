import WhatsAppModel from '../models/whatsapp.model.js';

// Middleware para agregar configuración de WhatsApp a todas las vistas
export const whatsappMiddleware = async (req, res, next) => {
  try {
    // Obtener la configuración de WhatsApp activa
    const whatsappConfig = await WhatsAppModel.findOne({ active: true });    
    
    // Si hay configuración, añadirla a res.locals
    if (whatsappConfig) {
      res.locals.whatsappNumber = whatsappConfig.url;
      res.locals.whatsappImage = whatsappConfig.urlImage;
      res.locals.whatsappMessage = encodeURIComponent(whatsappConfig.message);
    } else {
      // Valores predeterminados si no hay configuración
      res.locals.whatsappNumber = '';
      res.locals.whatsappMessage = '';
    }
  } catch (err) {
    console.error('Error al cargar la configuración de WhatsApp:', err);
    // Valores predeterminados en caso de error
    res.locals.whatsappNumber = '';
    res.locals.whatsappMessage = '';
  }

  // Continuar con el siguiente middleware o controlador
  next();
};
