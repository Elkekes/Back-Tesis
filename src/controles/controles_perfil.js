import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos los perfiles de usuario.
const get_perfiles = async(request, response) =>
{
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_usuario, nick_name, nombre, apellido_1, apellido_2, correo, numero_tel, fecha_registro, hora_registro FROM tab_perfil_usuario");
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

// Petición asincrona para optener solo un usuario.
const get_perfil = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT nick_name,correo, contrasena FROM tab_perfil_usuario WHERE id_usuario = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para actualizar el perfil de un usuario.
const put_perfil = async(request, response) =>
{
    try{
        //Creamos  las variables que se actualizarán en la base de datos.
        const {nick_name, nombre, apellido_1, apellido_2, numero_tel} = request.body;
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const perfil = {nick_name, nombre, apellido_1, apellido_2, numero_tel};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_perfil_usuario SET ? WHERE id_usuario = ?", [perfil, id]);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para eliminar solo un usuario.
const delete_perfil = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_perfil_usuario WHERE id_usuario = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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
    get_perfiles,
    get_perfil,
    put_perfil,
    delete_perfil
};
