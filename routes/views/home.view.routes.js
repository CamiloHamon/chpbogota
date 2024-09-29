import express from 'express';
import calculateYearsCompany from '../../helpers/multer/years.js';
import { getVideoShowInHome } from '../../controllers/videos.controller.js';
import { getAllNewsJson } from '../../controllers/news.controller.js';

const router = express.Router();

// Función para extraer el ID de videos de YouTube
function getYouTubeVideoID(url) {
  let videoID = null;
  try {
    const urlObj = new URL(url);

    // Caso de youtu.be
    if (urlObj.hostname === 'youtu.be') {
      videoID = urlObj.pathname.slice(1);
    }
    // Casos de youtube.com
    else if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        videoID = urlObj.searchParams.get('v');
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoID = urlObj.pathname.split('/embed/')[1];
      } else if (urlObj.pathname.startsWith('/v/')) {
        videoID = urlObj.pathname.split('/v/')[1];
      } else if (urlObj.pathname.startsWith('/shorts/')) {
        videoID = urlObj.pathname.split('/shorts/')[1];
      }
    }
  } catch (e) {
    console.error('URL de YouTube inválida:', url);
  }
  return videoID;
}

// Función para extraer el ID de videos de Vimeo
function getVimeoVideoID(url) {
  let videoID = null;
  try {
    const urlObj = new URL(url);

    // Caso de player.vimeo.com o vimeo.com
    if (urlObj.hostname === 'player.vimeo.com' || urlObj.hostname === 'vimeo.com') {
      const pathParts = urlObj.pathname.split('/');
      videoID = pathParts[pathParts.length - 1];
    }
  } catch (e) {
    console.error('URL de Vimeo inválida:', url);
  }
  return videoID;
}

// Función para generar la URL del iframe
function generateEmbedUrl(url) {
  let embedUrl = '';

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoID = getYouTubeVideoID(url);
    if (videoID) {
      embedUrl = `https://www.youtube.com/embed/${videoID}`;
    }
  } else if (url.includes('vimeo.com') || url.includes('player.vimeo.com')) {
    const videoID = getVimeoVideoID(url);
    if (videoID) {
      embedUrl = `https://player.vimeo.com/video/${videoID}`;
    }
  }

  return embedUrl;
}

router.get('/', async (req, res) => {
  const dateAniversary = '2004-06-12';
  const yearsCompany = calculateYearsCompany(dateAniversary);

  const video = await getVideoShowInHome();
  let videoUrl;
  if (video) videoUrl = generateEmbedUrl(video.url);

  const news = await getAllNewsJson();
  const formattedNews = news.map(article => ({
    ...article._doc, // Si estás usando Mongoose, extrae los datos del documento
    formattedDate: new Date(article.insert).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }));


  res.render('public/home',
    {
      layout: 'main',
      title: 'Colegio de Administradores de Propiedad Horizontal de Bogotá – CAPH Bogotá',
      activePage: 'inicio',
      aniversary: yearsCompany,
      videoUrl: videoUrl,
      videoTitle: video?.title,
      videoDescription: video?.description,
      news: formattedNews.length > 0 ? formattedNews : null
    });
});

export default router;
