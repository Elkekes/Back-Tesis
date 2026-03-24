import {inicio_conexion} from "../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona de todos los tipos de alojamiento.
const get_tipos = async(request, response) =>
{
    let conexion;
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id, descripcion, categoria FROM tab_servicios");
        //response.json("Mensaje de prueba jsjsjsjsj");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona de las imagenes de un anuncio.
const get_serviciosAnuncio = async (request, response) => {
    const { id_anuncio } = request.params;
    let conexion;
    try {
        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id, id_anuncio, id_servicio FROM tab_anuncio_servicio WHERE id_anuncio = ?", [id_anuncio]);

        // Verificamos si se obtuvieron los registros con las urls de la imagen.
        return mensaje_GET(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener los servicios del anuncio", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asíncrona para guardar múltiples servicios de un anuncio.
const post_serviciosAnuncios = async (request, response) => {
    let conexion;
    // Extraemos el ID del anuncio y el array de servicios del cuerpo de la petición.
    // Ejemplo esperado: { "id_anuncio": 5, "servicios": [1, 2, 8, 10] }
    const { id_anuncio, servicios } = request.body;

    try {
        // Validaciones iniciales
        if (!id_anuncio || !Array.isArray(servicios) || servicios.length === 0) {
            return response.status(400).json({ 
                message: "SOLICITUD NO VÁLIDA: Se requiere 'id_anuncio' y un arreglo de 'servicios' no vacío." 
            });
        }

        // Formatear los datos para MySQL
        // MySQL espera un formato de "Array de Arrays": [[id_anuncio, id_serv1], [id_anuncio, id_serv2]]
        const valoresParaInsertar = servicios.map(id_servicio => [id_anuncio, id_servicio]);

        conexion = await inicio_conexion();

        // Ejecutar el Insert Múltiple
        // Nota: En inserciones múltiples con mysql2 se usa [valoresParaInsertar] (doble corchete implícito)
        const sql = "INSERT IGNORE INTO tab_anuncio_servicio (id_anuncio, id_servicio) VALUES ?";
        const [resultado] = await conexion.query(sql, [valoresParaInsertar]);

        // Respuesta de éxito
        return response.status(201).json({
            message: `Se han guardado con éxito ${resultado.affectedRows} servicios para el anuncio ${id_anuncio}.`,
            detalles: resultado
        });

    } catch (error) {
        // Manejo de errores específicos
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ 
                message: "Error: Uno o más servicios ya están asignados a este anuncio." 
            });
        }

        mensaje_error(response, "Error al guardar la colección de servicios.", error);
    } finally {
        if (conexion) await conexion.end();
    }
};

export const metodos = {
    get_tipos,
    get_serviciosAnuncio,
    post_serviciosAnuncios
};