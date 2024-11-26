import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as historial_logs} from "./../controles/controles_historial_logs.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/historial/accesos", historial_logs.get_logs);
router.get("/historial/accesos/:id", historial_logs.get_log);
router.post("/historial/accesos", historial_logs.post_log);
router.delete("/historial/accesos/:id", historial_logs.delete_log);

export default router;