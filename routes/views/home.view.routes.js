import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('public/home', { layout: 'main', title: 'Colegio de Administradores de Propiedad Horizontal de Bogotá – CAPH Bogotá', activePage: 'inicio' });
});

export default router;
