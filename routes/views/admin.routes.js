import express from 'express';
const router = express.Router();

router.get('/revistas', (req, res) => {
  res.render('admin/common-areas', { layout: 'admin', title: 'Revistas', activePage: 'common-areas', csrfToken: req.csrfToken() });
});

router.get('/videos', (req, res) => {
  res.render('admin/videos', { layout: 'admin', title: 'Videos', activePage: 'videos', csrfToken: req.csrfToken() });
});

router.get('/galeria', (req, res) => {
  res.render('admin/gallery', { layout: 'admin', title: 'Galería', activePage: 'gallery', csrfToken: req.csrfToken() });
});

router.get('/usuarios', (req, res) => {
  res.render('admin/users', { layout: 'admin', title: 'Usuarios', activePage: 'users', csrfToken: req.csrfToken() });
});

router.get('/perfil', (req, res) => {
  res.render('admin/profile', { layout: 'admin', title: 'Perfil', activePage: 'perfil', csrfToken: req.csrfToken() });
});


export default router;
