import express from 'express';
import { getCommonAreas } from '../../controllers/commonAreas.controller.js';

const router = express.Router();

router.get('/', getCommonAreas);

export default router;
