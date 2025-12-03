import {inicio_conexion} from "../bd/bd_conexion.js";
import {metodos as controles_anuncios} from "./../controles/controles_anuncios.js";
import config from "./../config.js";
const axios = require('axios');


// Petición para la actualizar las coordenadas y direcion en la base de datos mediante API de googlemaps.
const sent_coordenadas = async(request, response) =>
{
    // Variables para almacenar rl id_usuario y la direccion enviada.
    const {id_anuncio,id_usuario,direccion} = request.body;
    const googleMapsApiKey = config.googleMapsApiKey;

    try{
        console.log(request.params);
        
        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined || id_usuario == undefined || direccion == undefined)
        {
             // Añadimos 'return' para asegurar que la ejecución se detenga aquí.
            return response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }
        
        // Realizacion de la consulta ala Api de Google Maps.
        const axiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: direccion,
                key: googleMapsApiKey,
            },
        });

        const apiStatus = axiosResponse.data.status;

        // Condición que muestrara los resultados de la consulta o si currio un fallo.
        if (apiStatus === 'OK') 
        {
            const location = axiosResponse.data.results[0].geometry.location;
            const lat = location.lat;
            const long = location.lng;

            // Al finalizar la consulta, se LLAMA A LA FUNCIÓN DE BD.
            // Es crucial NO ENVIAR respuesta HTTP aquí. La función de BD enviará la única respuesta.
            // Usamos 'return await' para asegurar que esperamos la función y devolvemos su resultado.
            return await controles_anuncios.put_anuncios_direccion(request, response, id_anuncio, id_usuario, direccion, lat, long);
        } 
        else 
        {
            // Manejo de errores de la API de Google (ZERO_RESULTS, REQUEST_DENIED, etc.).
            // Devolvemos el estado 404/500 con un mensaje más claro.
            console.error(`Error de geocodificación: ${apiStatus}`);
            return response.status(apiStatus === 'ZERO_RESULTS' ? 404 : 503).json({ 
                success: false, 
                message: `Error de geocodificación: ${apiStatus}. La dirección no pudo ser encontrada o la clave falló.`
            });
        }
        
    }catch(error){
        // Maneja errores de red, AXIOS, o errores internos.
        console.error("Error en sent_coordenadas:", error);
        return response.status(500).json({ success: 'error', message: 'Error interno del servidor al procesar la geocodificación.' });
    }
};

const get_coordenadas = async (request, response) => {
    const googleMapsApiKey = config.googleMapsApiKey;

    try {
        const { direccion } = request.params;

        if (!direccion) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese una dirección." });
        }

        const axiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: { address: direccion, key: googleMapsApiKey },
        });

        const apiData = axiosResponse.data;
        const apiStatus = apiData.status;

        if (apiStatus === 'OK') {
            // Se asume que results[0] existe si el status es OK.
            const location = apiData.results[0].geometry.location; 

            return response.json({
                success: true,
                latitud: location.lat,
                longitud: location.lng,
            });

        } else if (apiStatus === 'ZERO_RESULTS') {
            // 404 Not Found: La dirección no fue encontrada por la API
            return response.status(404).json({ 
                success: false, 
                message: "Dirección no encontrada por el servicio de geocodificación." 
            });

        } else if (apiStatus === 'REQUEST_DENIED' || apiStatus === 'OVER_QUERY_LIMIT') {
            // 503 Service Unavailable o 403 Forbidden: Problema con la clave o el límite de uso.
            console.error(`Error de la API de Google Maps: ${apiStatus}`);
            return response.status(503).json({ 
                success: false, 
                message: `Error interno de servicio: ${apiStatus}.` 
            });

        } else {
            // Para cualquier otro status no manejado explícitamente
            console.error(`Status de la API desconocido: ${apiStatus}`);
            return response.status(500).json({ success: false, message: 'Error desconocido en la API externa.' });
        }
        
    } catch (error) {
        // Maneja errores de red, DNS o internos del servidor (ej. variable config faltante)
        console.error("Error en la función get_coordenadas:", error.message);
        return response.status(500).json({ success: false, message: 'Error interno del servidor al procesar la solicitud.' });
    }
}

// Petición asincrona para la creacion de un anuncio mediante su dirección y coordenadas.
const post_coodenadas_bd = async (request, response, id_usuario,direccion,latitud, longitud) => {
    let conexion;
    try {
        // Validación para comprobar la existencia de datos.
        if ( id_usuario == undefined || direccion == undefined || latitud == undefined || longitud == undefined ) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Almacenamos las variables que se registrarán en la base de datos.
        const datos = { id_usuario, direccion, latitud, longitud};

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        conexion = await inicio_conexion();

        // Inserción SQL en la tabla.
        const resultado = await conexion.query("INSERT INTO tab_anuncio SET ?", datos);

        console.log(resultado);
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        console.log('Error en la carga de la imagen: ' + error.message);
        return;
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para la actualizacion de dirección y coordenadas en un anuncio.
const put_coodenadas_bd = async (request, response, id_anuncio, direccion, coordenadas) => {
    let conexion;
    try {
        // Validación para comprobar la existencia de datos.
        if (direccion == undefined || coordenadas == undefined || id_anuncio == undefined ) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Almacenamos las variables que se registrarán en la base de datos.
        const datos = { direccion, coordenadas };
        const id  = { id_anuncio };

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        conexion = await inicio_conexion();

        // Inserción SQL en la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [datos, id ]);

        console.log(resultado);
        // Mostramos el resultado en el navegador en formato Json.
        response.json(resultado);
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        response.status(500).send('Error en la carga de la imagen: ' + error.message);
        return;
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};


export const metodos = {
    sent_coordenadas,
    get_coordenadas
};
