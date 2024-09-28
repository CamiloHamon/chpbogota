// controllers/news.controller.js
import NewsModel from '../models/news.model.js';

// Obtener todas las noticias activas
export const getAllNews = async (req, res) => {
  try {
    const news = await NewsModel.find({ active: true }).sort({ insert: -1 });
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

// Obtener una noticia por ID
export const getNewsById = async (req, res) => {
  try {
    const news = await NewsModel.findOne({ _id: req.params.id, active: true });
    if (!news) {
      return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
    }
    res.json({ success: true, data: news });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la noticia',
    });
  }
};

// Obtener una noticia por Slug
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await NewsModel.findOne({ slug });

    if (!news) {
      return res.status(404).render('404', { message: 'Noticia no encontrada' });
    }

    // Construir la URL completa de la noticia
    const fullURL = `${req.protocol}://${req.get('host')}/noticias/${news.slug}`;

    // Generar las URLs de compartir
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullURL)}`;
    const twitterShareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullURL)}&text=${encodeURIComponent(news.title)}`;
    const whatsappShareURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(news.title)}%20${encodeURIComponent(fullURL)}`;

    // Renderizar la plantilla con los datos de la noticia y las URLs de compartir
    return res.render('public/news-detail', {
      layout: 'main',
      title: news.title,
      activePage: 'news',
      subtitle: news.subtitle,
      author: news.author,
      date: news.insert.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: news.content, // Asegúrate de que el contenido está sanitizado
      image: news.image || '/images/default-news.jpg', // Imagen de la noticia
      facebookShareURL,
      twitterShareURL,
      whatsappShareURL,
    });
  } catch (error) {
    console.error('Error al obtener la noticia:', error);
    return res.status(500).render('500', { message: 'Error interno del servidor' });
  }
};