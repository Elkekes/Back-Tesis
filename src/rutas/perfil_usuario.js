import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_perfil} from "./../controles/controles_perfil.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/perfiles/usuarios", controles_perfil.get_usuarios);
router.get("/perfil/:id_usuario", controles_perfil.get_usuario);
router.post("/perfil/:id_usuario", controles_perfil.post_perfil);
router.put("actualizar/perfil",controles_perfil.put_usuario_actual);
router.delete("/perfil/:id", controles_perfil.delete_perfil);

router.get("/paises", controles_perfil.get_paises);
router.get("/estados/:idPais", controles_perfil.get_estados_por_pais);

export default router;