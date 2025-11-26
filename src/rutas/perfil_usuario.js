import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_perfil} from "./../controles/controles_perfil.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/perfiles", controles_perfil.get_perfiles);
router.get("/perfil/:id", controles_perfil.get_perfil);
router.put("/perfil/:id", controles_perfil.put_perfil);
router.delete("/perfil/:id", controles_perfil.delete_perfil);

router.get("/usuario/actual", controles_perfil.get_usuario_actual);
router.put("/usuario/actual", controles_perfil.put_usuario_actual);
router.get("/paises", controles_perfil.get_paises);
router.get("/estados/:idPais", controles_perfil.get_estados_por_pais);

export default router;