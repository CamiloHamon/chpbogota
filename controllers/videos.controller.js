import VideosModel from '../models/videos.js';

// Obtener todos los bienes comunes
export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideosModel.find({active: true});
    res.json({
        success: true,
        data: videos
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        error: 'Error al obtener los videos'
    });
  }
};
