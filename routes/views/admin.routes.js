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

// News
// Página de administración de noticias
router.get('/noticias', isAdmin, (req, res) => {
    res.render('admin/news', {
        layout: 'admin',
        title: 'Noticias',
        activePage: 'news',
        csrfToken: req.csrfToken(),
    });
});

// Links
// Página de administración de enlaces de interes
router.get('/enlaces-de-interes', isAdmin, (req, res) => {
    res.render('admin/links', {
        layout: 'admin',
        title: 'Enlaces de interés',
        activePage: 'links',
        csrfToken: req.csrfToken(),
    });
});

// Associates
// Página de administración de enlaces de asociados
router.get('/asociados', isAdmin, (req, res) => {
    res.render('admin/associates', {
        layout: 'admin',
        title: 'Asociados',
        activePage: 'associates',
        csrfToken: req.csrfToken(),
    });
});

// WhatsApp
// Página de administración de WhatsApp
router.get('/whatsapp', isAdmin, (req, res) => {
    res.render('admin/whatsapp', {
        layout: 'admin',
        title: 'WhatsApp',
        activePage: 'whatsapp',
        csrfToken: req.csrfToken(),
    });
});

export default router;
