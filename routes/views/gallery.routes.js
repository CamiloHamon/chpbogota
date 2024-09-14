import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('gallery', { layout: 'main', title: 'Galería', activePage: 'gallery' });
});

export default router;
