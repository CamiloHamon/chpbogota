import GalleryModel from '../models/gallery.js';

// Obtener todos los bienes comunes
export const getGalleriesActive = async (req, res) => {
  try {
    const galleries = await GalleryModel.find({ active: true });
    res.json({
      success: true,
      data: galleries
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la galeria'
    });
  }
};

export const getGalleries = async (req, res) => {
  try {
    const galleries = await GalleryModel.find()
    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedGalleries = galleries.map(gallery => {
      return {
        ...gallery._doc, // Utiliza `._doc` para acceder a los datos originales de Mongoose
        urlImage: `/images/gallery/${gallery.urlImage}`
      };
    });

    res.json({
      success: true,
      data: updatedGalleries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las galerias'
    });
  }
};

export const toggleGalleryStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const gallery = await GalleryModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Galeria no encontrado' });
    }

    res.json({ success: true, data: gallery });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado de la galeria'
    });
  }
};

export const addGallery = async (req, res) => {
  try {
    // Asegúrate de que los campos se reciben correctamente
    const { title, url, urlImage } = req.body;
    // Verificar si todos los campos requeridos están presentes
    if (!title || !url || !urlImage) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const date = new Date();
    // Crear una nueva instancia del modelo
    const newGallery = new GalleryModel({
      title,
      urlImage,
      url,
      active: true,
      insert: date,
      update: date
    });

    // Guardar en la base de datos
    await newGallery.save();

    return res.status(201).json({
      success: true,
      message: 'Video creado exitosamente',
      video: newGallery
    });
  } catch (error) {
    console.error('Error al crear la galeria:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getGallery = async (req, res) => {
  try {
    const gallery = await GalleryModel.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Galeria no encontrada' });
    }
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export const updateGallery = async (req, res) => {
  const { id } = req.params;
  const { title, url, urlImage } = req.body;

  try {
    // Buscar y actualizar la galeria por ID
    const date = new Date();
    const updatedGallery = await GalleryModel.findByIdAndUpdate(
      id, // ID de la galeria que vamos a actualizar
      {
        title,
        url,
        urlImage,
        update: date
      },
      { new: true } // Retornar el documento actualizado
    );

    // Si no se encuentra el documento, retornar un error 404
    if (!updatedGallery) {
      return res.status(404).json({
        success: false,
        message: 'Galleria no encontrada'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Galeria actualizada con éxito',
      commonArea: updatedGallery
    });
  } catch (error) {
    console.error('Error al actualizar la galeria:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

