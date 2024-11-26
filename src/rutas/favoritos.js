import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_favoritos} from "./../controles/controles_favoritos.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/favoritos", controles_favoritos.get_favoritos);
router.get("/favoritos/:id", controles_favoritos.get_favorito);
router.post("/favoritos", controles_favoritos.post_favorito);
router.delete("/favoritos/:id", controles_favoritos.delete_favorito);

export default router;