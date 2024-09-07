import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('commonAreas', { layout: 'main', title: 'Bienes comunes', activePage: 'bienescomunes' });
});

export default router;
