import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import bcrypt from 'bcryptjs';
import { engine } from 'express-handlebars';
import fileStore from 'session-file-store';

// Inicializa dotenv para acceder a las variables de entorno
dotenv.config();

// Inicializa la aplicación Express
const app = express();

// Middleware de seguridad y manejo de cabeceras HTTP
app.use(helmet());

// Logger de peticiones HTTP
app.use(morgan('dev'));

// Manejo de datos POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Parsear cookies
app.use(cookieParser());

// CORS (configurable según necesidad)
app.use(cors());

// Limitar el número de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 solicitudes por IP
});
app.use(limiter);

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configuración de sesiones con almacenamiento en archivos
const FileStore = fileStore(session);
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Cambiar a true si usas HTTPS
}));

// Protección CSRF
app.use(csurf({ cookie: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', csrfToken: req.csrfToken() });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log(err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
