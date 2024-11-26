import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos los tipos de alojamiento.
const get_tipos = async(request, response) =>
{
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_alojamiento, descripcion FROM tab_tipo_alojamiento");
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

// Petición asincrona para optener un tipo de alojamiento.
const get_tipo = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del tipo de alojamiento."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query("SELECT id_alojamiento, descripcion FROM tab_tipo_alojamiento WHERE id_alojamiento = ?", id);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para agregar un tipo de alojamiento.
const post_tipo = async(request, response) =>
{
    try{
        // Creamos las variables que se registraran en la base de datos.
        const {descripcion} = request.body;

        // Validación para comprobar existencia de datos.
        if ( descripcion == undefined)
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se registraran en la base de datos.
        const alojamiento = {descripcion};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_tipo_alojamiento SET ?", alojamiento );
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};


// Petición asincrona para actualizar un tipo de alojamiento.
const put_tipo = async(request, response) =>
{
    try{
        //Creamos  las variables que se actualizarán en la base de datos.
        const {descripcion} = request.body;
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del tipo de alojamiento."});
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const tipo_alojamiento = {descripcion};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_tipo_alojamiento SET ? WHERE id_alojamiento = ?", [tipo_alojamiento, id]);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }  
};

// Petición asincrona para eliminar un tipo de alojamiento.
const delete_tipo = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del tipo de alojamiento."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_tipo_alojamiento WHERE id_alojamiento = ?", id ); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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
    get_tipos,
    get_tipo,
    post_tipo,
    put_tipo,
    delete_tipo
};
