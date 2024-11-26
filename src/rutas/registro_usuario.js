import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_registro_usuario} from "./../controles/controles_registro_usuario.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.post("/registrar", controles_registro_usuario.add_registrar);

export default router;