import WhatsAppModel from '../models/whatsapp.model.js';

// Obtener la configuración activa de WhatsApp
export const getWhatsAppConfig = async (req, res) => {
  try {
    const whatsappConfig = await WhatsAppModel.findOne();
    if (!whatsappConfig) {
      return res.status(404).json({
        success: false,
        message: 'No hay configuración activa de WhatsApp.'
      });
    }
    res.json({
      success: true,
      data: whatsappConfig
    });
  } catch (err) {
    console.error('Error al obtener la configuración de WhatsApp:', err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la configuración de WhatsApp'
    });
  }
};

// Actualizar la configuración de WhatsApp
export const updateWhatsAppConfig = async (req, res) => {
  const { url, message, active } = req.body;

  try {
    // Asegurarse de que solo exista un registro en la base de datos
    const existingConfig = await WhatsAppModel.findOneAndUpdate(
      {}, // No se utiliza ninguna condición específica, porque solo debe haber un registro
      { url, message, active, update: new Date() }, // Se actualizan los valores
      { new: true, upsert: true } // upsert para crear si no existe
    );

    res.json({
      success: true,
      message: 'Configuración de WhatsApp actualizada correctamente.',
      data: existingConfig
    });
  } catch (err) {
    console.error('Error al actualizar la configuración de WhatsApp:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la configuración de WhatsApp'
    });
  }
};
