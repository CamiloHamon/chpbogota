// middlewares/auth.js

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/auth');
};

export const noAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Debes cerrar sesion para ver esta pagina');
    res.redirect('/admin/revistas');
};

