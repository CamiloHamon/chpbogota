import express from 'express';
import { getAllCommonAreas, toggleCommonAreaStatus, addCommonArea, getCommonArea, updateCommonArea } from '../../controllers/commonAreas.controller.js';
import { uploadImage, deleteImage } from '../../controllers/images.controller.js';
import { addVideo, getVideo, getVideos, toggleVideosStatus, updateVideo } from '../../controllers/videos.controller.js';
import { addGallery, getGalleries, getGallery, toggleGalleryStatus, updateGallery } from '../../controllers/gallery.controller.js';
import { createNewUser, deleteUser, getAllUsers, getProfile, getUser, updateProfile, updateUser } from '../../controllers/user.controller.js';
import { addNews, getAllNewsAdmin, getNews, toggleNewsStatus, updateNews } from '../../controllers/news.admin.controller.js';

import { isAuthenticated, isAdmin, isSuperAdmin } from '../../middlewares/auth.js';

const adminRouter = express.Router();

// Aplicar middlewares generales de autenticación y rol
adminRouter.use(isAuthenticated); // Todas las rutas a continuación requieren autenticación
adminRouter.use(isAdmin); // Solo admin y superadmin pueden acceder a las rutas a continuación

// Rutas de Common Areas
adminRouter.get('/common-areas', getAllCommonAreas);
adminRouter.patch('/common-areas/:id/toggle-status', toggleCommonAreaStatus);
adminRouter.post('/common-areas/add', addCommonArea);
adminRouter.get('/common-areas/:id', getCommonArea);
adminRouter.put('/common-areas/:id', updateCommonArea);

// Rutas de Imágenes
adminRouter.post('/upload-image/:folder', uploadImage);
adminRouter.delete('/delete-image/:folder', deleteImage);

// Rutas de Videos
adminRouter.get('/videos', getVideos);
adminRouter.patch('/videos/:id/toggle-status', toggleVideosStatus);
adminRouter.post('/videos/add', addVideo);
adminRouter.get('/videos/:id', getVideo);
adminRouter.put('/videos/:id', updateVideo);

// Rutas de Galerías
adminRouter.get('/gallery', getGalleries);
adminRouter.patch('/gallery/:id/toggle-status', toggleGalleryStatus);
adminRouter.post('/gallery/add', addGallery);
adminRouter.get('/gallery/:id', getGallery);
adminRouter.put('/gallery/:id', updateGallery);

// Rutas de Usuarios - Solo superadmin
adminRouter.route('/users')
    .get(isSuperAdmin, getAllUsers) // Solo superadmin puede ver todos los usuarios
    .post(isSuperAdmin, createNewUser); // Solo superadmin puede crear nuevos usuarios

adminRouter.route('/users/:id')
    .get(isSuperAdmin, getUser) // Solo superadmin puede ver un usuario específico
    .put(isSuperAdmin, updateUser) // Solo superadmin puede actualizar un usuario
    .delete(isSuperAdmin, deleteUser); // Solo superadmin puede eliminar un usuario

// Profile
adminRouter.get('/profile', getProfile);
adminRouter.put('/profile', updateProfile);

// News

// API para obtener todas las noticias
adminRouter.get('/news', isAdmin, getAllNewsAdmin);

// API para agregar una noticia
adminRouter.post('/news/add', isAdmin, addNews);

// API para obtener una noticia por ID
adminRouter.get('/news/:id', isAdmin, getNews);

// API para actualizar una noticia
adminRouter.put('/news/:id', isAdmin, updateNews);

// API para cambiar el estado de una noticia
adminRouter.patch('/news/:id/toggle-status', isAdmin, toggleNewsStatus);

export default adminRouter;