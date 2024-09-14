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
        "https://player.vimeo.com" // Permitir iframes de Vimeo
      ],
      "script-src": [
        "'self'", 
        "https://www.youtube.com", 
        "https://www.youtube-nocookie.com", 
        "https://player.vimeo.com" // Permitir scripts de Vimeo
      ],
      "img-src": [
        "'self'", 
        "https://i.ytimg.com", 
        "https://i.vimeocdn.com" // Permitir imágenes de Vimeo
      ],
      "media-src": [
        "'self'", 
        "https://player.vimeo.com" // Permitir recursos multimedia de Vimeo
      ],
      "connect-src": [
        "'self'",
        "https://player.vimeo.com", // Permitir conexiones a los servidores de Vimeo
        "https://f.vimeocdn.com"    // Conexiones necesarias para cargar el contenido de Vimeo
      ]
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

app.use('/', homeViewRoutes);
app.use('/quienesomos', whoiamViewRoutes);
app.use('/servicios', servicesViewRoutes);
app.use('/bienescomunes', commonAreas);
app.use('/videos', videosRoutes);
app.use('/galeria', galleryRoutes);

// APIs
// Importar rutas
import commonAreasApi from './routes/api/common-areas.api.routes.js';
import videosApi from './routes/api/videos.api.routes.js';
import galleryApi from './routes/api/gallery.api.routes.js';

app.use('/api/common-areas', commonAreasApi);
app.use('/api/videos', videosApi);
app.use('/api/gallery', galleryApi);

// Conectar a la base de datos
connectDB();  // Establece la conexión al iniciar la app

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
