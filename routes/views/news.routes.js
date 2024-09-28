// routes/public/news.routes.js
import express from 'express';
import { getNewsBySlug } from '../../controllers/news.controller.js';

const router = express.Router();

// Página principal de noticias
router.get('/', (req, res) => {
  res.render('public/news', { layout: 'main', title: 'Noticias', activePage: 'news' });
});

// Página de una noticia específica
router.get('/:slug', getNewsBySlug);


export default router;
