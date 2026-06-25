import { inicio_conexion } from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona de todos las notificaciones.
const get_notificaciones = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)// Mensage en consola con los datos enviados en la url.
        const { id_usuario } = request.params;// Guardamos el id de la reservacion mandado en la url.

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined || id_usuario === null || id_usuario === '') {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });

        }
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();

        await conexion.query("SET lc_time_names = 'es_MX';");

        /*
        %W: Nombre completo del día de la semana (Lunes, Martes, etc.).

        %e: Número del día del mes sin ceros a la izquierda (1, 2, ... 15, etc.).

        %M: Nombre completo del mes (Enero, Febrero, Junio, etc.).

        %H: Hora en formato de dos dígitos de 24 horas (00 a 23).

        %h: Hora en formato de dos dígitos de 12 horas (00 a 12).

        %p: Formato AM/PM

        %i: Minutos con dos dígitos (00 a 59).
        */

        // Consulta SQl a la tabla. 
        const resultado = await conexion.query(
            `SELECT 
            id_notificacion,id_reservacion, descripcion, titulo, DATE_FORMAT(fecha_cita, '%W, %e de %M') AS fecha_cita, TIME_FORMAT(hora_cita, '%h:%i %p') AS hora_cita, id_usuario, visualizacion
            FROM vista_notificacion 
            WHERE id_usuario = ?
            AND (visualizacion IS NULL OR visualizacion = 0)`,
            [id_usuario]
        );

        // Log en consola de los datos devueltos
        console.log(resultado);

        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener notificaciones:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para agregar un usuario.
const post_notificacion = async (request, response) => {
    let conexion;
    try {
        const body = request.body; // Almacenmos en un obgeto los valores mandados en el cuerpó de la solicitud.
        const notificacion = {}; // Objeto que almacenara los datos a guardar en la base de datos.
        const camposPermitidos = ['id_tipo_notificacion', 'id_reservacion', 'id_usuario', 'visualizacion'];

        // Evaluamos si TODOS los elementos de 'camposPermitidos' existen dentro del objeto 'body'.
        const estanTodosLosCampos = camposPermitidos.every(campo =>
            body[campo] !== undefined && body[campo] !== null && body[campo] !== ''
        );

        // Si falta aunque sea uno solo de los campos requeridos, frenamos la petición de inmediato
        if (!estanTodosLosCampos) {
            return response.status(400).json({
                message: "SOLICITUD INCOMPLETA FALTAN DATOS PARA LA SOLICITUD: Todos los campos son obligatorios."
            });
        }

        // Creamos  las variables que se agregarán en la base de datos. Solo agregamos al objeto lo que realmente viene en el request.
        for (const key in body) {
            if (camposPermitidos.includes(key)) {
                notificacion[key] = body[key];
            }
        }

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        conexion = await inicio_conexion();
        // Inserción SQL en la tabla.
        const resultado = await conexion.query("INSERT INTO tab_notificacion SET ?", notificacion);

        //Llamado a función que muestra y envía el resultado de las consultas.
        return mensaje_POST(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error en al registrar:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para actualizar una notificacón.
const put_notificacion = async (request, response) => {
    let conexion; // Declaramos la variable de conexión con la base de datos.
    try {
        // Asignamos el id del anuncio proporcionado en la URl.
        const { id_notificacion } = request.params;// Guardamos el id_notificacion de la notificación mandado en la url.
        const { visualizacion } = request.body;// Almacenmos en un obgeto los valores mandados en el cuerpó de la solicitud.

        if (id_notificacion === undefined || id_notificacion === null || id_notificacion === '') {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Parámetros faltantes." });
        }

        // Verificamos que 'visualizacion' sea exactamente 0 o 1. Cualquier otra cosa (null, undefined, un string, un 5) será rechazada.
        if (visualizacion !== 0 && visualizacion !== 1) {
            return response.status(400).json({
                message: "SOLICITUD NO VÁLIDA: El campo no se ha enviado el nuevo estado."
            });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const notificacion = { visualizacion };

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();

        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_notificacion SET ? WHERE id_notificacion = ?", [notificacion, id_notificacion]);

        // Verificamos si se actualizó algún registro.
        return mensaje_PUT(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error en la actualización la notificación.", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

export const metodos = {
    get_notificaciones,
    post_notificacion,
    put_notificacion
};