// routes/adminViews.js

import express from 'express';
import { isAuthenticated, isAdmin, isSuperAdmin } from '../../middlewares/auth.js';

const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas de este router
router.use(isAuthenticated);

// Rutas accesibles por admin y superadmin
router.get('/revistas', isAdmin, (req, res) => {  
    res.render('admin/common-areas', { 
        layout: 'admin', 
        title: 'Revistas', 
        activePage: 'common-areas', 
        csrfToken: req.csrfToken(),
    });
});

router.get('/videos', isAdmin, (req, res) => {
    res.render('admin/videos', { 
        layout: 'admin', 
        title: 'Videos', 
        activePage: 'videos', 
        csrfToken: req.csrfToken() 
    });
});

router.get('/galeria', isAdmin, (req, res) => {
    res.render('admin/gallery', { 
        layout: 'admin', 
        title: 'Galería', 
        activePage: 'gallery', 
        csrfToken: req.csrfToken() 
    });
});

router.get('/perfil', isAdmin, (req, res) => {
    res.render('admin/profile', { 
        layout: 'admin', 
        title: 'Perfil', 
        activePage: 'profile', 
        csrfToken: req.csrfToken() 
    });
});

// Ruta accesible solo por superadmin
router.get('/usuarios', isSuperAdmin, (req, res) => {
    res.render('admin/users', { 
        layout: 'admin', 
        title: 'Usuarios', 
        activePage: 'users', 
        csrfToken: req.csrfToken() 
    });
});

export default router;
