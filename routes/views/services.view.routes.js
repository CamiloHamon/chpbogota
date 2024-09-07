import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('services', { layout: 'main', title: 'Servicios', activePage: 'servicios' });
});

export default router;
