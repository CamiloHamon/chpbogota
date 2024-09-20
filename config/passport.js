import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

// Configurar la estrategia local de Passport
passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Indicamos que el nombre de usuario será el campo 'email'
    async (email, password, done) => {
      try {
        // Buscar al usuario por email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Revisa tus credenciales' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Revisa tus credenciales' });
        }

        // Si todo está bien, devolver el usuario
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializar el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
