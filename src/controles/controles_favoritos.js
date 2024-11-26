import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos los favoritos.
const get_favoritos = async(request, response) =>
{
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_favorito, id_anuncio, id_usuario, fecha, hora FROM tab_favoritos");
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

// Petición asincrona para optener un anuncio a favoritos.
const get_favorito = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query("SELECT id_favorito, id_anuncio, id_usuario, fecha, hora FROM tab_favoritos WHERE id_favorito = ?", id);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};


// Petición asincrona para agregar un anuncio a favoritos.
const post_favorito = async(request, response) =>
{
    try{
        // Creamos las variables que se registraran en la base de datos.
        const {id_anuncio, id_usuario, fecha, hora} = request.body;

        // Validación para comprobar existencia de datos.
        if (id_anuncio== undefined || id_usuario == undefined || fecha == undefined || hora == undefined)
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se registraran en la base de datos.
        const anuncio = {id_anuncio, id_usuario, fecha, hora};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const favorito = await get_conexion();
        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_favoritos SET ?", favorito );
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};


// Petición asincrona para eliminar un anuncio de favoritos.
const delete_favorito = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_favoritos WHERE id_favorito = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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
    get_favoritos,
    get_favorito,
    post_favorito,
    delete_favorito
};
