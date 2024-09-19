import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contactUs', { layout: 'main', title: 'Contacto', activePage: 'contacto', csrfToken: req.csrfToken() });
});

export default router;
