import getMulterInstance from '../helpers/multer/multer.js';

// Para manejar rutas en ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import fs from 'fs';

// Controlador para manejar la subida de imágenes
export const uploadImage = (req, res) => {
    const { folder } = req.params;

    // Aquí ya no necesitas `.single()` porque el middleware está completo
    const upload = getMulterInstance(folder);

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha subido ningún archivo' });
        }

        res.json({
            success: true,
            filePath: req.file.filename // Devolver la ruta completa del archivo
        });
    });
};

export const deleteImage = (req, res) => {
    try {
        const { folder } = req.params;
        const { filePath } = req.body;        
        
        const _filePath = path.join(__dirname, '..', 'public/images', folder, filePath);
        // Verificar si el archivo existe
        fs.access(_filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            // Si existe, eliminar el archivo
            fs.unlink(_filePath, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error al eliminar el archivo' });
                }

                res.json({ success: true, message: 'Archivo eliminado con éxito' });
            });
        });
    } catch (error) {        
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
