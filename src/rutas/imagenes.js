import {Router} from "express";

// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_imagenes} from "../controles/controles_imagenes.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/imagenes/:id", controles_imagenes.get_imagenes);
router.get("/imagen", controles_imagenes.get_imagen_principal);
router.post("/imagen/upload/:id_anuncio/:num_imagen", controles_imagenes.post_imagen_serv);
router.put("/imagen/:direccion", controles_imagenes.put_imagen);
router.delete("/imagen/:direccion", controles_imagenes.delete_imagen);

export default router;