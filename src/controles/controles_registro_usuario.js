import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona para agregar un usuario.
const add_registrar = async(request, response) =>
{
    try{
        // Creamos las variables que se registraran en la base de datos.
        const {id_usuario} = request.body;

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se registraran en la base de datos.
        const perfil = {id_usuario};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Inserción SQl a la tabla. 
        const resultado = await conexion.query("INSERT INTO tab_perfil_usuario SET ?", perfil );
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
    add_registrar
};