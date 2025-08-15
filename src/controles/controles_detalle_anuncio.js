import {inicio_conexion} from "./../bd/bd_conexion.js";
import { mensaje_error,mensaje_consultas } from "../mensajes/mensajes_consultas.js";

// Petición asincrona para optener un solo anuncio.
const get_anuncio = async(request, response) =>
{
    const {id_anuncio} = request.params;
    try{

        //console.log(request.params) //Visualización de parametros enviados en la consola.
        const conexion = await inicio_conexion(); // Declaracion de conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar. 
        
        //Consulta SQl a la tabla. Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query(`
            SELECT id_anuncio, id_usuario, id_alojamiento, titulo, descripcion, precio, num_habitaciones, num_camas, num_banos, fecha_inicio, fecha_fin 
            FROM tab_anuncio 
            WHERE id_anuncio = ?`, 
            [id_anuncio]
        );

        //Llamado a función que muestra y envía el resultado de las consultas.
        return mensaje_consultas(response, resultado); 

    }catch(error){
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "❌ Error al obtener el anuncio:", error);
    }  
};

export const metodos = {
    get_anuncio
};

