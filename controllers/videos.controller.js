import VideosModel from '../models/videos.js';

// Obtener todos los bienes comunes
export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideosModel.find({ active: true });
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

export const getVideos = async (req, res) => {
  try {
    const videos = await VideosModel.find()
    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedVideos = videos.map(video => {
      return {
        ...video._doc, // Utiliza `._doc` para acceder a los datos originales de Mongoose
        urlImage: `/images/videos/${video.urlImage}`
      };
    });

    res.json({
      success: true,
      data: updatedVideos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los videos'
    });
  }
};

export const toggleVideosStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const video = await VideosModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Bien común no encontrado' });
    }

    res.json({ success: true, data: video });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado del video'
    });
  }
};

export const addVideo = async (req, res) => {
  try {
    // Asegúrate de que los campos se reciben correctamente
    const { title, description, url, urlImage } = req.body;
    // Verificar si todos los campos requeridos están presentes
    if (!title || !description || !url || !urlImage) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const date = new Date();
    // Crear una nueva instancia del modelo
    const newVideo = new VideosModel({
      title,
      urlImage,
      url,
      description,
      type: 'iframe',
      active: true,
      insert: date,
      update: date
    });

    // Guardar en la base de datos
    await newVideo.save();

    return res.status(201).json({
      success: true,
      message: 'Video creado exitosamente',
      video: newVideo
    });
  } catch (error) {
    console.error('Error al crear el video:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await VideosModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrada' });
    }
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, url, urlImage } = req.body;

  try {
    // Buscar y actualizar el CommonArea por ID
    const date = new Date();
    const updatedVideo = await VideosModel.findByIdAndUpdate(
      id, // ID del Video que vamos a actualizar
      {
        title,
        description,
        url,
        urlImage,
        update: date
      },
      { new: true } // Retornar el documento actualizado
    );

    // Si no se encuentra el documento, retornar un error 404
    if (!updatedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video no encontrada'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Video actualizada con éxito',
      commonArea: updatedVideo
    });
  } catch (error) {
    console.error('Error al actualizar el video:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getVideoShowInHome = async (req, res) => {
  try {
    const video = await VideosModel.findOne({active: true, showInHome: true});
    return video;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export const setShowInHome = async (req, res) => {
  const { id } = req.params;
  try {
      // Primero, establecer showInHome a false para todos los videos
      await VideosModel.updateMany({ showInHome: true }, { showInHome: false });

      // Luego, establecer showInHome a true para el video seleccionado
      const video = await VideosModel.findByIdAndUpdate(id, { showInHome: true }, { new: true });

      if (!video) {
          return res.status(404).json({ success: false, error: 'Video no encontrado' });
      }

      res.json({ success: true, data: video });
  } catch (error) {
      console.error('Error al establecer showInHome:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const toggleShowInHome = async (req, res) => {
  const { id } = req.params;
  const { showInHome } = req.body;

  try {
      if (showInHome) {
          // Primero, establecer showInHome a false para todos los videos
          await VideosModel.updateMany({ showInHome: true }, { showInHome: false });
      }

      // Luego, actualizar el showInHome del video seleccionado
      const video = await VideosModel.findByIdAndUpdate(id, { showInHome }, { new: true });

      if (!video) {
          return res.status(404).json({ success: false, error: 'Video no encontrado' });
      }

      res.json({ success: true, data: video });
  } catch (error) {
      console.error('Error al actualizar showInHome:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};