import express from 'express';
import { getGalleriesActive } from '../../controllers/gallery.controller.js';

const router = express.Router();

router.get('/', getGalleriesActive);

export default router;
