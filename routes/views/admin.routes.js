import express from 'express';
const router = express.Router();

router.get('/revistas', (req, res) => {
  res.render('admin/common-areas', { layout: 'admin', title: 'Revistas', activePage: 'revistas', csrfToken: req.csrfToken() });
});

router.get('/videos', (req, res) => {
  res.render('admin/videos', { layout: 'admin', title: 'Videos', activePage: 'videos', csrfToken: req.csrfToken() });
});


export default router;
