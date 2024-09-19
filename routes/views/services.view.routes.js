import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('public/services', { layout: 'main', title: 'Servicios', activePage: 'servicios' });
});

export default router;
