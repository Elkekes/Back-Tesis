import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_favoritos} from "./../controles/controles_favoritos.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/favoritos/:id_usuario", controles_favoritos.get_favoritos); //Obtener todos los favoritos de un usuario
router.post("/favoritos", controles_favoritos.post_favorito);// Agregar favorito a un usuario
router.delete("/favoritos", controles_favoritos.delete_favorito);// Eliminar favorito a un usuario

export default router;