import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import { engine } from 'express-handlebars';
import fileStore from 'session-file-store';
import connectDB from './config/db.js'; // Importa la función de conexión

// Para manejar rutas en ES Modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializa dotenv para acceder a las variables de entorno
dotenv.config();

// Inicializa la aplicación Express
const app = express();

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(join(__dirname, 'public')));

// Middleware de seguridad y manejo de cabeceras HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "frame-src": [
        "'self'",
        "https://www.youtube.com",
        "https://player.vimeo.com",
        "https://www.google.com",           // Permitir iframes de Google
        "https://maps.google.com"           // Permitir iframes de Google Maps
      ],
      "script-src": [
        "'self'",
        "'unsafe-inline'",                  // Necesario para scripts inline de Google Maps
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
        "https://player.vimeo.com",
        "https://maps.googleapis.com",      // Permitir scripts de Google Maps API
        "https://maps.gstatic.com"
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",                  // Necesario para estilos inline de Google Maps
        "https://fonts.googleapis.com",
        "https://maps.googleapis.com",
        "https://maps.gstatic.com"
      ],
      "img-src": [
        "'self'",
        "data:",                            // Permitir imágenes inline en base64
        "https://i.ytimg.com",
        "https://i.vimeocdn.com",
        "https://maps.googleapis.com",
        "https://maps.gstatic.com",
        "https://maps.google.com",
        "https://maps.gstatic.com",
        "https://www.google.com"
      ],
      "connect-src": [
        "'self'",
        "https://player.vimeo.com",
        "https://f.vimeocdn.com",
        "https://maps.googleapis.com",
        "https://maps.gstatic.com",
        "https://www.google.com",
        "https://clients4.google.com",
        "https://clients2.google.com"
      ],
      "font-src": [
        "'self'",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      "media-src": [
        "'self'",
        "https://player.vimeo.com"
      ],
      "object-src": ["'none'"],             // Bloquear objetos embebidos (por seguridad)
      "base-uri": ["'self'"],
      "form-action": ["'self'"]
    }
  }
}));

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

// Configuración de Handlebars con helpers personalizados
app.engine('handlebars', engine({
  defaultLayout: 'main', // Define un layout predeterminado
  layoutsDir: join(__dirname, 'views', 'layouts'), // Define la carpeta de layouts
  partialsDir: join(__dirname, 'views', 'partials'),
  helpers: {
    eq: (v1, v2) => v1 === v2 // Helper personalizado para comparaciones
  }
}));

app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

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

// Rutas
// Importar rutas
import homeViewRoutes from './routes/views/home.view.routes.js';
import whoiamViewRoutes from './routes/views/whoiam.view.routes.js';
import servicesViewRoutes from './routes/views/services.view.routes.js';
import commonAreas from './routes/views/common-areas.routes.js';
import videosRoutes from './routes/views/videos.routes.js';
import galleryRoutes from './routes/views/gallery.routes.js';
import contactRoutes from './routes/views/contact-us.routes.js';

app.use('/', homeViewRoutes);
app.use('/quienesomos', whoiamViewRoutes);
app.use('/servicios', servicesViewRoutes);
app.use('/bienescomunes', commonAreas);
app.use('/videos', videosRoutes);
app.use('/galeria', galleryRoutes);
app.use('/contacto', contactRoutes);

// APIs
// Importar rutas
import commonAreasApi from './routes/api/common-areas.api.routes.js';
import videosApi from './routes/api/videos.api.routes.js';
import galleryApi from './routes/api/gallery.api.routes.js';
import contactApi from './routes/api/contact-us.api.routes.js';

app.use('/api/common-areas', commonAreasApi);
app.use('/api/videos', videosApi);
app.use('/api/gallery', galleryApi);
app.use('/api/contact', contactApi);

// Conectar a la base de datos
connectDB();  // Establece la conexión al iniciar la app

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
