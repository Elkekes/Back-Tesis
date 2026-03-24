import {Router} from "express";
// Exportacionde la carpeta de funciones que administra las peticiones.
import {metodos as controles_anuncios} from "./../controles/controles_anuncios.js"; 
import {metodos as controles_detalle_anuncio} from "./../controles/controles_detalle_anuncio.js"; 

// Creación de un enrutador (permitira manejar las rutas de nuestro crud).
const  router = Router();


router.get("/anuncios/buscar/:termino?", controles_anuncios.buscar_anuncios); //dejalo aquí como primera ruta declarada, porque si lo dejamos abajo, no jala


// Asignacion de rutas al enrutador.
router.get("/anuncios", controles_anuncios.get_anuncios);
router.get("/anuncios/incompletos/:id_usuario", controles_anuncios.get_anuncios_incompletos);
router.get("/anuncios/:id_anuncio", controles_detalle_anuncio.get_anuncio);
router.get("/last/post/:id_usuario", controles_anuncios.get_UltimoAnuncio);
router.get("/anuncios/actualizar/:id_anuncio/:id_usuario", controles_anuncios.get_AnuncioInfo);
router.get("/anuncios/perfil/:id_anuncio", controles_anuncios.get_AnunciosInfo);
router.get("/anuncios/imagenes/:id_anuncio", controles_anuncios.get_AnuncioImg);
router.get("/anuncios/publicaciones/:id_usuario", controles_anuncios.get_publicaciones);
router.get("/anuncios/numero/activos", controles_anuncios.get_numero_activos); //Ruta para consultar los anuncios completos en existencia
router.get("/anuncios/numero/:tipo_alojamiento", controles_anuncios.get_numero_tipo); // Ruta para consultar total de anuncios por filtro "Tipo_anuncio"
router.get("/anuncios/publicados/filtrar/:tipo_anuncio", controles_anuncios.get_anuncios_filtro);
router.post("/anuncios/publicar", controles_anuncios.post_anuncios);
router.put("/anuncios/:id_anuncio", controles_anuncios.put_anuncios);
router.put("/anuncios/tipoalojamiento/:id_anuncio", controles_anuncios.put_tipoalojamiento);
router.put("/anuncios/cantidades/:id_anuncio", controles_anuncios.put_cantidades);
router.put("/anuncios/descripcion/:id_anuncio", controles_anuncios.put_descripcion);
router.put("/anuncios/fecha/:id_anuncio", controles_anuncios.put_fecha);
router.put("/anuncios/status/:id_anuncio", controles_anuncios.put_status);
router.delete("/anuncios/:id_anuncio", controles_anuncios.delete_anuncios);


// router.get("/anuncios/buscar/:termino?", (req, res, next) => {
//     console.log('🔍 RUTA /anuncios/buscar EJECUTADA');
//     console.log('📝 Parámetros:', req.params);
//     console.log('🔍 Query:', req.query);
//     next();
// }, controles_anuncios.buscar_anuncios);

export default router;