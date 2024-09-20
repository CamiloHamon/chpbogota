// routes/auth.js

import express from 'express';
const router = express.Router();
import passport from '../../config/passport.js';
import { isAuthenticated, noAuthenticated } from '../../middlewares/auth.js';
import crypto from 'crypto';
import User from '../../models/user.model.js';
import { transporter } from '../../config/nodemailer.js';

// Ruta para mostrar el formulario de login
router.get('/', noAuthenticated, (req, res) => {
  res.render('auth/login', {
    layout: 'auth',
    title: 'Login',
    csrfToken: req.csrfToken(), // Asegúrate de que el token CSRF se pase correctamente
  });
});

// Ruta para manejar el login con Passport
router.post('/', noAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si la autenticación falla, renderizamos la vista sin redireccionar todavía
      req.flash('error', info.message || 'Error de autenticación');
      return res.redirect('/auth'); // Redirige después de la autenticación fallida (PRG)
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/admin/revistas'); // Redirige al dashboard en caso de éxito
    });
  })(req, res, next);
});

// Ruta para cerrar sesión
router.get('/logout', isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash('success_msg', 'Has cerrado sesión exitosamente');
    res.redirect('/auth');
  });
});

// Ruta para mostrar el formulario de recuperación de contraseña
router.get('/forgot', noAuthenticated, (req, res) => {
  res.render('auth/forgot', { layout: 'auth', title: 'Recuperar Contraseña', csrfToken: req.csrfToken() });
});

// Ruta para manejar el envío del formulario de recuperación de contraseña
router.post('/forgot', noAuthenticated, async (req, res) => {
  const { email } = req.body;
  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'No existe una cuenta con ese email');
      return res.redirect('/auth/forgot');
    }

    // Generar token de restablecimiento de contraseña
    const token = crypto.randomBytes(20).toString('hex');

    // Establecer token y fecha de expiración en el usuario
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Configurar el correo electrónico
    const mailOptions = {
      to: user.email,
      from: 'colegiophbogota@gmail.com',
      subject: 'Restablecer tu contraseña',
      text: `
Estás recibiendo esto porque tú (u otra persona) ha solicitado restablecer la contraseña de tu cuenta.

Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:

http://${req.headers.host}/auth/reset/${token}

Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.
            `,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);

    req.flash('success_msg', 'Se ha enviado un email con instrucciones para restablecer tu contraseña');
    res.redirect('/auth');
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    req.flash('error_msg', 'Error al enviar email de recuperación');
    res.redirect('/auth/forgot');
  }
});

// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/reset/:token', noAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Verificar que el token no ha expirado
    });

    if (!user) {
      req.flash('error_msg', 'El token es inválido o ha expirado');
      return res.redirect('/auth/forgot');
    }

    res.render('auth/reset', { token: req.params.token, layout: 'auth', title: 'Restablecer Contraseña', csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error al mostrar formulario de restablecimiento:', error);
    req.flash('error_msg', 'Error al mostrar formulario de restablecimiento');
    res.redirect('/auth/forgot');
  }
});

// Ruta para manejar el restablecimiento de contraseña
router.post('/reset/:token', noAuthenticated, async (req, res) => {
  const { password, passwordConfirm } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Verificar que el token no ha expirado
    });

    if (!user) {
      req.flash('error_msg', 'El token es inválido o ha expirado');
      return res.redirect('/auth/forgot');
    }

    if (!password || !passwordConfirm) {
      req.flash('error_msg', 'Por favor, completa todos los campos');
      return res.redirect(`/auth/reset/${req.params.token}`);
    }

    if (password !== passwordConfirm) {
      req.flash('error_msg', 'Las contraseñas no coinciden');
      return res.redirect(`/auth/reset/${req.params.token}`);
    }

    // Validar que la nueva contraseña cumple con los requisitos
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      req.flash('error_msg', 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial');
      return res.redirect(`/auth/reset/${req.params.token}`);
    }

    // Actualizar la contraseña del usuario
    user.password = password; // Será encriptada en el middleware pre-save

    // Limpiar los campos de restablecimiento
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    req.flash('success_msg', 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.');
    res.redirect('/auth');
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    req.flash('error_msg', 'Error al restablecer contraseña');
    res.redirect('/auth/forgot');
  }
});

export default router;
