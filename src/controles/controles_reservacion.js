import {inicio_conexion} from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona de todos las reservaciones.
const get_reservaciones = async(request, response) =>
{
    let conexion;
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado, confirmacion_visto
                                                FROM vista_reservacion`);
        // Log en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
        
    }catch(error){
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservaciones:", error);
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }   
};

// Petición asincrona para optener una reservación.
const get_reservacion = async(request, response) =>
{
    let conexion;
    try{
        console.log(request.params)
        const {id_reservacion} = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion == undefined || id_reservacion === null || id_reservacion === '' )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' de la reservación."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado, confirmacion_visto
                                                FROM vista_reservacion
                                                WHERE id_reservacion = ?`, id_reservacion);

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    }catch(error){
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservacion:", error);
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }   
};

// Petición asincrona para agrgar una reservacion.
const post_reservacion = async(request, response) =>
{
    let conexion;
    try{

        // Creamos las variables que se registraran en la base de datos.
        const {id_anuncio, id_usuario, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, confirmacion_usuario, id_estado_reservacion } = request.body;

        // Agrupamos los campos estrictamente obligatorios para el registro
        const camposObligatorios = [id_anuncio, id_usuario, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, confirmacion_usuario, id_estado_reservacion];

        // Evaluamos si alguno es null, undefined, o string vacío
        const tieneCamposVacios = camposObligatorios.some(campo => campo === undefined || campo === null || campo === '');

        if (tieneCamposVacios) {
            // Return para que no continue con la consulta a la base de datos
            return response.status(400).json({
                message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos obligatorios."
            });
        }

        // Creamos el objeto limpio que coincide exactamente con las columnas de la BD
        const datosReservacion = { 
            id_anuncio, 
            id_usuario, 
            fecha_solicitud, 
            hora_solicitud, 
            fecha_cita, 
            hora_cita, 
            confirmacion_usuario, 
            id_estado_reservacion 
        };

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();

        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_reservacion SET ?", datosReservacion );

        // ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_POST(response, resultado);
    }catch(error){
       //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al actualizar reservación:", error);
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    };   
};

// Petición asincrona para eliminar una reservación.
const cancelar_reservacion = async(request, response) =>
{
    let conexion;
    try{
        console.log(request.params)
        const {id_reservacion} = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion== undefined || id_reservacion === null || id_reservacion === '')
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' de la reservación."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_reservacion SET id_estado_reservacion = 3 WHERE id_reservacion = ?", id_reservacion); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        // ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        mensaje_PUT(resultado);
    }catch(error){
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al cancelar reservación:", error);
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }  
};

export const metodos = {
    get_reservaciones,
    get_reservacion,
    post_reservacion,
    cancelar_reservacion
};