import CommonArea from '../models/commonArea.model.js';

// Obtener todos los bienes comunes
export const getCommonAreas = async (req, res) => {
  try {
    const commonAreas = await CommonArea.find({ active: true });
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

export const getAllCommonAreas = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const commonAreas = await CommonArea.find()
      .skip(skip)
      .limit(Number(limit));

    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedCommonAreas = commonAreas.map(area => {
      return {
        ...area._doc, // Utiliza `._doc` para acceder a los datos originales de Mongoose
        urlImage: `/images/common-areas/${area.urlImage}`
      };
    });

    const total = await CommonArea.countDocuments();

    res.json({
      success: true,
      data: updatedCommonAreas,
      last_row: total,
      page: Number(page),
      last_page: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los bienes comunes'
    });
  }
};

export const toggleCommonAreaStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const commonArea = await CommonArea.findByIdAndUpdate(id, { active }, { new: true });
    if (!commonArea) {
      return res.status(404).json({ success: false, error: 'Bien común no encontrado' });
    }

    res.json({ success: true, data: commonArea });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado del bien común'
    });
  }
};
