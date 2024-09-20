import express from 'express';
import { getAllCommonAreas, toggleCommonAreaStatus, addCommonArea, getCommonArea, updateCommonArea } from '../../controllers/commonAreas.controller.js';
import { uploadImage, deleteImage } from '../../controllers/images.controller.js';
import { addVideo, getVideo, getVideos, toggleVideosStatus, updateVideo } from '../../controllers/videos.controller.js';

const router = express.Router();

// common areas
router.get('/common-areas', getAllCommonAreas);
router.patch('/common-areas/:id/toggle-status', toggleCommonAreaStatus);
router.post('/common-areas/add', addCommonArea);
router.get('/common-areas/:id', getCommonArea);
router.put('/common-areas/:id', updateCommonArea);
// imgs
router.post('/upload-image/:folder', uploadImage);
router.delete('/delete-image/:folder', deleteImage);

//videos
router.get('/videos', getVideos);
router.patch('/videos/:id/toggle-status', toggleVideosStatus);
router.post('/videos/add', addVideo);
router.get('/videos/:id', getVideo);
router.put('/videos/:id', updateVideo);

export default router;
