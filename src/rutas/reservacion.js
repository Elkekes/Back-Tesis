import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_reservacion}  from"./../controles/controles_reservacion.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/reservaciones", controles_reservacion.get_reservaciones);
router.get("/reservacion/:id_reservacion", controles_reservacion.get_reservacion);
router.get("/reservaciones/inquilino/:id_inquilino", controles_reservacion.get_reservacion_inquilino);
router.get("/reservaciones/propietario/:id_propietario", controles_reservacion.get_reservacion_propietario);
router.post("/reservacion/crear", controles_reservacion.post_reservacion);
router.put("/reservacion/actualizar/:id_reservacion", controles_reservacion.confirmar_reservacion);
router.put("/reservacion/cancelar/:id_reservacion", controles_reservacion.cancelar_reservacion);

export default router;