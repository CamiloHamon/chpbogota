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
    const commonAreas = await CommonArea.find()
    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedCommonAreas = commonAreas.map(area => {
      return {
        ...area._doc, // Utiliza `._doc` para acceder a los datos originales de Mongoose
        urlImage: `/images/common-areas/${area.urlImage}`
      };
    });

    res.json({
      success: true,
      data: updatedCommonAreas,
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

export const addCommonArea = async (req, res) => {
  try {
    // Asegúrate de que los campos se reciben correctamente
    const { title, edition, url, urlImage } = req.body;
    // Verificar si todos los campos requeridos están presentes
    if (!title || !edition || !url || !urlImage) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const date = new Date();
    // Crear una nueva instancia del modelo
    const newCommonArea = new CommonArea({
      title,
      edition,
      urlImage,
      url,
      active: true,
      insert: date,
      update: date
    });

    // Guardar en la base de datos
    await newCommonArea.save();

    return res.status(201).json({
      success: true,
      message: 'Área común creada exitosamente',
      commonArea: newCommonArea
    });
  } catch (error) {
    console.error('Error al crear área común:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCommonArea = async (req, res) => {
  try {
    const commonArea = await CommonArea.findById(req.params.id);
    if (!commonArea) {
      return res.status(404).json({ success: false, message: 'Revista no encontrada' });
    }
    res.json({ success: true, commonArea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export const updateCommonArea = async (req, res) => {
  const { id } = req.params;
  const { title, edition, url, urlImage } = req.body;

  try {
      // Buscar y actualizar el CommonArea por ID
      const date = new Date();
      const updatedCommonArea = await CommonArea.findByIdAndUpdate(
          id, // ID del CommonArea que vamos a actualizar
          {
              title,
              edition,
              url,
              urlImage,
              update: date
          }, 
          { new: true } // Retornar el documento actualizado
      );

      // Si no se encuentra el documento, retornar un error 404
      if (!updatedCommonArea) {
          return res.status(404).json({
              success: false,
              message: 'Área común no encontrada'
          });
      }

      // Respuesta exitosa
      return res.status(200).json({
          success: true,
          message: 'Área común actualizada con éxito',
          commonArea: updatedCommonArea
      });
  } catch (error) {
      console.error('Error al actualizar el área común:', error);
      return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
      });
  }
};
