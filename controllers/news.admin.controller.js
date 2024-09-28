// controllers/news.admin.controller.js
import NewsModel from '../models/news.model.js';

// Obtener todas las noticias (activas e inactivas)
export const getAllNewsAdmin = async (req, res) => {
  try {
    const news = await NewsModel.find().sort({ insert: -1 });
    res.json({
      success: true,
      data: news,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las noticias',
    });
  }
};

// Crear una nueva noticia
export const addNews = async (req, res) => {
  try {
    const { title, subtitle, author, content } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ success: false, message: 'Los campos título, autor y contenido son obligatorios' });
    }

    const date = new Date();

    const newNews = new NewsModel({
      title,
      subtitle,
      author,
      content,
      active: true,
      insert: date,
      update: date,
    });

    await newNews.save();

    return res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      data: newNews,
    });
  } catch (error) {
    console.error('Error al crear la noticia:', error);
    // Manejar errores de duplicidad de slug
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(400).json({
        success: false,
        message: 'El slug generado ya existe. Por favor, utiliza un título diferente.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Obtener una noticia por ID para editar
export const getNews = async (req, res) => {
  try {
    const news = await NewsModel.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
    }
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar una noticia
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, author, content } = req.body;

  try {
    const date = new Date();

    const updatedNews = await NewsModel.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        author,
        content,
        update: date,
      },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Noticia actualizada con éxito',
      data: updatedNews,
    });
  } catch (error) {
    console.error('Error al actualizar la noticia:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

// Cambiar el estado de una noticia (activar/inactivar)
export const toggleNewsStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const news = await NewsModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!news) {
      return res.status(404).json({ success: false, error: 'Noticia no encontrada' });
    }

    res.json({ success: true, data: news });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado de la noticia',
    });
  }
};
