import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_servicios} from "../controles/controles_servicio.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/servicios", controles_servicios.get_tipos);
router.get("/servicios/:id_anuncio", controles_servicios.get_serviciosAnuncio);
router.post("/servicios/insertar", controles_servicios.post_servicios_anuncio);

export default router;