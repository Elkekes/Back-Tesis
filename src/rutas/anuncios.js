import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_anuncios} from "./../controles/controles_anuncios.js"; 
import {metodos as controles_detalle_anuncio} from "./../controles/controles_detalle_anuncio.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();

// Asignacion de rutas al enrutador.
router.get("/anuncios", controles_anuncios.get_anuncios);
router.get("/anuncios/incompletos/:id_usuario", controles_anuncios.get_anuncios_incompletos);
router.get("/anuncios/:id_anuncio", controles_detalle_anuncio.get_anuncio);
router.post("/anuncios/publicar", controles_anuncios.post_anuncios);
router.put("/anuncios/", controles_anuncios.put_anuncios);
router.put("/anuncios/tipoalojamiento/:id_anuncio", controles_anuncios.put_tipoalojamiento);
router.put("/anuncios/cantidades/:id_anuncio", controles_anuncios.put_cantidades);
router.put("/anuncios/descripcion/:id_anuncio", controles_anuncios.put_descripcion);
router.put("/anuncios/fecha/:id_anuncio", controles_anuncios.put_fecha);
router.delete("/anuncios/:id_anuncio", controles_anuncios.delete_anuncios);
router.get("/last/post/:id_usuario", controles_anuncios.get_UltimoAnuncio);
router.get("/anuncios/perfil/:id_anuncio", controles_anuncios.get_AnuncioInfo);
router.get("/anuncios/imagenes/:id_anuncio", controles_anuncios.get_AnuncioImg);

export default router;