import {Router} from "express";
import { upload } from "../config/multer.js"; // Importamos la configuración de multer
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_imagenes} from "../controles/controles_imagenes.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/imagenes/:id", controles_imagenes.get_imagenes);
router.get("/imagen", controles_imagenes.get_imagen_principal);
//router.post("/imagen/upload", controles_imagenes.post_imagen_serv);
router.post('/imagen/upload', upload.array('imagen', 10), controles_imagenes.post_imagen_anuncio);
router.put("/imagen/:direccion", controles_imagenes.put_imagen);
//router.delete("/imagen/:direccion", controles_imagenes.delete_imagen)
router.delete("/imagen/url", controles_imagenes.delete_imagen);

export default router;