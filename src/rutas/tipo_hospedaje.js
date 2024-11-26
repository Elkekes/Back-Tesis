import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_tipo_hospedaje} from "./../controles/controles_tipo_hospedaje.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/tipo-hospedaje", controles_tipo_hospedaje.get_tipos);
router.get("/tipo-hospedaje/:id", controles_tipo_hospedaje.get_tipo);
router.post("/tipo-hospedaje", controles_tipo_hospedaje.post_tipo);
router.put("/tipo-hospedaje/:id", controles_tipo_hospedaje.put_tipo);
router.delete("/tipo-hospedaje/:id", controles_tipo_hospedaje.delete_tipo);

export default router;