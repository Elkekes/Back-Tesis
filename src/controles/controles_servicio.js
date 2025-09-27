import {inicio_conexion} from "../bd/bd_conexion.js";

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

export const metodos = {
    get_tipos,
};