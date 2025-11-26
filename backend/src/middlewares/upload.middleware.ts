import multer from 'multer';
import path from 'path';

// Configuración de dónde se guardarán los archivos temporalmente
const storage = multer.diskStorage({
    destination: 'uploads/', // Esta carpeta se creará sola si no existe
    filename: (req, file, cb) => {
        // Le ponemos un nombre único con la fecha actual para que no se pisen
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;