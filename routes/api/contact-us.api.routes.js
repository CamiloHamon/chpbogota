import express from 'express';
import { saveMessage } from '../../controllers/contactUs.controller.js';

const router = express.Router();

router.post('/save', saveMessage);

export default router;
