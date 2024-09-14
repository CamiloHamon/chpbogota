import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('videos', { layout: 'main', title: 'Videos', activePage: 'videos' });
});

export default router;
