import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_reservacion}  from"./../controles/controles_reservacion.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/reservaciones", controles_reservacion.get_reservaciones);
router.get("/reservacion/:id", controles_reservacion.get_reservacion);
router.post("/reservacion", controles_reservacion.post_reservacion);
router.delete("/reservacion/:id", controles_reservacion.delete_reservacion);

export default router;