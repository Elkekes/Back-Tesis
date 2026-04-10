import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Configuración de guardado de la imagen.
const storage = multer.diskStorage({
    destination: path.join(process.cwd(), 'src/public/uploads'), // Usa process.cwd() para evitar líos con __dirname en ES Modules
    filename: function (req, file, cb) {
        // Se Utiliza el nombre original proporcionado por Multer para optener la extensión original.
        const ext = path.extname(file.originalname);
        //Por último se concatena el nombre aleatorio + exención.
        cb(null, uuidv4() + ext);
    }
});

// Filtros para el guardado de la imagen.
const fileFilter = (req, file, cb) => {
    // Solo se permitan las extensiones que deseas (jpg, png, etc.)
    const allowedExtensions = ['.jpg', '.jpeg', '.png','.avif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Exportamos solo la configuración de storage para usarla en las rutas
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});