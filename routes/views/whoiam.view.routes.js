import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('public/whoiam', { layout: 'main', title: 'Quiénes somos', activePage: 'quienesomos' });
});

export default router;
