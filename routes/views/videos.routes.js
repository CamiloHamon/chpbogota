import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('public/videos', { layout: 'main', title: 'Videos', activePage: 'videos' });
});

export default router;
