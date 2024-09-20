import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Para manejar rutas en ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para crear el almacenamiento de multer dinámicamente basado en el folderName
const getMulterInstance = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../public/images', folderName);
            // Verificar si la carpeta existe, si no, crearla
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    return multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|avif|webp|gif/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error('Solo se permiten imágenes'));
        }
    }).single('urlImage'); // Asegúrate de que aquí defines "single" o "array"
};

export default getMulterInstance;

