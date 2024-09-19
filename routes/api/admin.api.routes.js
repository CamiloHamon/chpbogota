import express from 'express';
import { getCommonAreas, getAllCommonAreas, toggleCommonAreaStatus } from '../../controllers/commonAreas.controller.js';

const router = express.Router();

router.get('/common-areas', getAllCommonAreas);
router.patch('/common-areas/:id/toggle-status', toggleCommonAreaStatus);

export default router;
