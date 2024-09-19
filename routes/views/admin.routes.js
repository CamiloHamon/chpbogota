import express from 'express';
const router = express.Router();

router.get('/revistas', (req, res) => {
  res.render('admin/common-areas', { layout: 'admin', title: 'Revistas', activePage: 'revistas', csrfToken: req.csrfToken() });
});

export default router;
