import {Router} from "express";

// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_maps} from "../controles/controles_maps.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.put("/api/maps", controles_maps.sent_coordenadas);
router.get("/api/maps/:direccion", controles_maps.get_coordenadas);
//router.put("/api/maps", controles_maps.put_imagen);

export default router;