import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos las reservaciones.
const get_reservaciones = async(request, response) =>
{
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_reservacion,id_usuario,id_anuncio,fecha_inicio,fecha_fin,id_estado_reservacion,precio_total FROM tab_reservacion");
        //response.json("Mensaje de prueba jsjsjsjsj");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};
// Petición asincrona para optener una reservación.
const get_reservacion = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' de la reservación."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query("SELECT id_reservacion,id_usuario,id_anuncio,fecha_inicio,fecha_fin,id_estado_reservacion,precio_total FROM tab_reservacion WHERE id_reservacion = ?", id);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para agrgar una reservacion.
const post_reservacion = async(request, response) =>
{
    try{
        // Creamos las variables que se registraran en la base de datos.
        const {id_usuario,id_anuncio,fecha_inicio, fecha_fin,id_estado_reservacion,precio_total} = request.body;

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined || id_anuncio == undefined || fecha_inicio == undefined || fecha_fin == undefined || id_estado_reservacion == undefined || precio_total == undefined)
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se registraran en la base de datos.
        const anuncio = {id_usuario,id_anuncio,fecha_inicio,fecha_fin,id_estado_reservacion,precio_total};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_reservacion SET ?", anuncio );
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para eliminar una reservación.
const delete_reservacion = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' de la reservación."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_reservacion WHERE id_reservacion = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

export const metodos = {
    get_reservaciones,
    get_reservacion,
    post_reservacion,
    delete_reservacion
};