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
        const resultado = await conexion.query("SELECT id AS id_servicio, descripcion, categoria FROM tab_servicios");
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
const post_servicios_anuncio = async (request, response) => {
    let conexion;
    try {
        const { id_anuncio, servicios: serviciosNuevos } = request.body;

        // Validación de datos
        if (!id_anuncio || !Array.isArray(serviciosNuevos)) {
            return response.status(400).json({ message: "Faltan datos en la petición." });
        }

        conexion = await inicio_conexion();

        // Obtenemos los servicios actuales en BD
        const filas = await conexion.query(
            "SELECT id_servicio FROM tab_anuncio_servicio WHERE id_anuncio = ?",
            [id_anuncio]
        );


        if (!Array.isArray(filas)) {
            return response.status(500).json({ message: "Error al obtener servicios actuales." });
        }

        const serviciosActuales = filas.map(f => f.id_servicio);

        // Calculamos qué agregar y qué eliminar
        const agregar  = serviciosNuevos.filter(id => !serviciosActuales.includes(id));
        const eliminar = serviciosActuales.filter(id => !serviciosNuevos.includes(id));

        console.log("Servicios a agregar:", agregar);
        console.log("Servicios a eliminar:", eliminar);

        // Solo insertamos los nuevos
        for (const id_servicio of agregar) {
            await conexion.query(
                "INSERT INTO tab_anuncio_servicio SET ?",
                { id_anuncio, id_servicio }
            );
            console.log("Servicio agregado: " + id_servicio);
        }

        // Solo eliminamos los que ya no están
        for (const id_servicio of eliminar) {
            await conexion.query(
                "DELETE FROM tab_anuncio_servicio WHERE id_anuncio = ? AND id_servicio = ?",
                [id_anuncio, id_servicio]
            );
        }

        return response.json({
            message: "Servicios actualizados correctamente.",
            agregados: agregar.length,
            eliminados: eliminar.length
        });

    } catch (error) {
        console.error("Error en post_servicios_anuncio:", error);
        return response.status(500).json({ 
            message: "Error interno del servidor.", 
            error: error.message 
        });
    } finally {
        if (conexion) await conexion.end();
    }
};

export const metodos = {
    get_tipos,
    get_serviciosAnuncio,
    post_servicios_anuncio
};