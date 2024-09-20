import express from 'express';
import { getAllCommonAreas, toggleCommonAreaStatus, addCommonArea, getCommonArea, updateCommonArea } from '../../controllers/commonAreas.controller.js';
import { uploadImage, deleteImage } from '../../controllers/images.controller.js';
import { addVideo, getVideo, getVideos, toggleVideosStatus, updateVideo } from '../../controllers/videos.controller.js';
import { addGallery, getGalleries, getGallery, toggleGalleryStatus, updateGallery } from '../../controllers/gallery.controller.js';
import { createNewUser, deleteUser, getAllUsers, getProfile, getUser, updateProfile, updateUser } from '../../controllers/user.controller.js';

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

//gallery
router.get('/gallery', getGalleries);
router.patch('/gallery/:id/toggle-status', toggleGalleryStatus);
router.post('/gallery/add', addGallery);
router.get('/gallery/:id', getGallery);
router.put('/gallery/:id', updateGallery);

//users
router.post('/users/add', createNewUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
// profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
