// middlewares/auth.js

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/auth');
};

// Middleware para verificar si el usuario NO está autenticado
export const noAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Debes cerrar sesión para ver esta página');
    res.redirect('/admin/revistas');
};

// Middleware para verificar roles permitidos
export const checkRole = (roles) => (req, res, next) => {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
        return next();
    }
    req.flash('error_msg', 'No tienes permisos para acceder a esta página');
    res.redirect('/auth');
};

// Middleware específico para Admin (admin y superadmin)
export const isAdmin = checkRole(['admin', 'superadmin']);

// Middleware específico para Superadmin (solo superadmin)
export const isSuperAdmin = checkRole(['superadmin']);
