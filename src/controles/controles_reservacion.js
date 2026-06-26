import { inicio_conexion } from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona de todos las reservaciones.
const get_reservaciones = async (request, response) => {
    let conexion;
    try {
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado
                                                FROM vista_reservacion`);
        // Log en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservaciones:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para obtener una reservación.
const get_reservacion = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_reservacion } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion == undefined || id_reservacion === null || id_reservacion === '') {
           return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado
                                                FROM vista_reservacion
                                                WHERE id_reservacion = ?`, id_reservacion);

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para obtener una reservación por inquilinos.
const get_reservacion_inquilino = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_usuario } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined || id_usuario === null || id_usuario === '') {
           return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado
                                                FROM vista_reservacion
                                                WHERE inquilino = ?`, id_usuario);

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
}; 

// Petición asincrona para obtener una reservación por inquilinos.
const get_reservacion_propietario = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_usuario } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_usuario  == undefined || id_usuario  === null || id_usuario  === '') {
           return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                id_reservacion, anuncio, propietario, inquilino, fecha_solicitud, hora_solicitud, fecha_cita, hora_cita, 
                                                confirmacion_propietario, confirmacion_inquilino, estado
                                                FROM vista_reservacion
                                                WHERE propietario = ?`, id_usuario );

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición para obtener el Identificador del Inquilino en un anuncio.
const get_idInquilino = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_reservacion } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion  == undefined || id_reservacion  === null || id_reservacion  === '') {
           return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                inquilino
                                                FROM vista_reservacion
                                                WHERE id_reservacion = ?`, id_reservacion );

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
} 

// Petición para obtener el Identificador del Inquilino en un anuncio.
const get_idPropietario = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_reservacion } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion  == undefined || id_reservacion  === null || id_reservacion  === '') {
           return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`SELECT
                                                propietario
                                                FROM vista_reservacion
                                                WHERE id_reservacion = ?`, id_reservacion );

        //  ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_GET(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
}

// Petición asincrona para agrgar una reservacion.
const post_reservacion = async (request, response) => {
    let conexion;
    try {
        const body = request.body; // Almacenmos en un obgeto los valores mandados en el cuerpó de la solicitud.
        const reservacion = {}; // Objeto que almacenara los datos a guardar en la base de datos.
        const camposPermitidos = ['id_anuncio', 'id_usuario', 'fecha_cita', 'hora_cita', 'confirmacion_usuario', 'id_estado_reservacion'];// Agrupamos los campos estrictamente obligatorios para el registro
        
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
                reservacion[key] = body[key];
            }
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();

        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_reservacion SET ?", reservacion);

        // ConsoeLog en consola de los datos devueltos
        console.log(resultado);

        /*EXTRACCIÓN CRÍTICA: Obtenemos el ID autoincrementable generado por MySQL 
        suele venir directo en resultado.insertId o resultado[0].insertId dependiendo de tu configuración exacta de conexion.query.*/
        const id_reservacion_creada = resultado.insertId || (resultado[0] && resultado[0].insertId);
        console.log('ID de la reservación creada con éxito:', id_reservacion_creada); // Mnesage en consola del id_reservacion creado.

        // Mostramos el resutlado en el navegador en formato Json.
        return response.status(201).json({
            success: true,
            data: resultado,
            count: resultado.length,
            id_reservacion: id_reservacion_creada // Devolvemos el dato de la reservación creada.
        });
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al actualizar reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    };
};

// Petición para actualizar datos "hora & fecha", "confirmaciónes" y "estado de la reservación" en la tabla de reservaciones.
const confirmar_reservacion = async (request, response) => {
    let conexion; // Declaramos la variable de conexión.
    try {
        console.log(request.params)
        const { id_reservacion } = request.params; // Guardamos el id de la reservacion mandado en la url.
        const body = request.body;// Almacenmos en un obgeto los valores mandados en el cuerpó de la solicitud.
        const reservacion = {};// Objeto que almacenara los datos a guardar en la base de datos.
        const camposPermitidos = ['fecha_cita', 'hora_cita', 'confirmacion_prop', 'confirmacion_usuario','id_estado_reservacion'];

        // Validación para comprobar existencia de datos.
        if (id_reservacion == undefined || id_reservacion === null || id_reservacion === '') {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor proporcione los datos necesarios" });
        }

        // Creamos  las variables que se actualizarán en la base de datos. Solo agregamos al objeto lo que realmente viene en el request.
        for (const key in body) {
            if (camposPermitidos.includes(key) && body[key] !== undefined && body[key] !== null) {
                reservacion[key] = body[key];
            }
        }

        // Si el cuerpo venía vacío o sin campos permitidos, evitamos una consulta SQL vacía
        if (Object.keys(reservacion).length === 0) {
            return response.status(400).json({ message: "No se proporcionaron campos válidos para actualizar." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_reservacion SET ? WHERE id_reservacion = ?", [reservacion, id_reservacion]);

        // Verificamos si se actualizó algún registro.
        return mensaje_PUT(response, resultado);
    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error alactualizar la reservación:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para eliminar una reservación.
const cancelar_reservacion = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_reservacion } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_reservacion == undefined || id_reservacion === null || id_reservacion === '') {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese los parámetros necesarios" });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_reservacion SET id_estado_reservacion = 3 WHERE id_reservacion = ?", id_reservacion); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        // ConsoeLog en consola de los datos devueltos
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        mensaje_PUT(response,resultado);
    } catch (error) {
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
    get_reservacion_inquilino,
    get_reservacion_propietario,
    get_idInquilino,
    get_idPropietario,
    post_reservacion,
    confirmar_reservacion,
    cancelar_reservacion
};