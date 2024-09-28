// routes/public/news.routes.js
import express from 'express';
import { getAllNews, getNewsById } from '../../controllers/news.controller.js';

const router = express.Router();

// API para obtener todas las noticias activas
router.get('/', getAllNews);
// API para obtener una noticia por ID
router.get('/:id', getNewsById);

export default router;
