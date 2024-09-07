import CommonArea from '../models/commonArea.model.js';

// Obtener todos los bienes comunes
export const getCommonAreas = async (req, res) => {
  try {
    const commonAreas = await CommonArea.find({active: true});
    res.json({
        success: true,
        data: commonAreas
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        error: 'Error al obtener los bienes comunes'
    });
  }
};
