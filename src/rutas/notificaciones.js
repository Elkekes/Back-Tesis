import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_notificacion}  from"./../controles/controles_notificaciones.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/notificacion/:id_usuario", controles_notificacion.get_notificaciones);
router.post("/notificacion/nueva", controles_notificacion.post_notificacion);
router.put("/notificacion/actualizar/:id_notificacion", controles_notificacion.put_notificacion);
export default router;