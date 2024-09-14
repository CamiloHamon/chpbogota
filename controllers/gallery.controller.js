import GalleryModel from '../models/gallery.js';

// Obtener todos los bienes comunes
export const getGallery = async (req, res) => {
  try {
    const galleries = await GalleryModel.find({active: true});
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
