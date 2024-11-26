import {get_conexion} from "../bd/bd_conexion.js";
import {metodos as controles_anuncios} from "./../controles/controles_anuncios.js"; 
const axios = require('axios');


// Petición para la actualizar las coordenadas y direcion en la base de datos mediante API de googlemaps.
const sent_coordenadas = async(request, response) =>
{
    // Variables para almacenar rl id_usuario y la direccion enviada.
    const {id_anuncio,id_usuario,direccion} = request.body;
    // "Key" O "Clave" para acceder ala api de maps.
    const googleMapsApiKey = 'AIzaSyAJKhEZG06SRCHgQQiuv1fncdI-FUsj_PE';

    try{
        console.log(request.params);
        
        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined || id_usuario == undefined ||direccion== undefined)
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }
        else
        {
            //Realizacion de la consulta ala Api, se le proporciona la credencial "La clave de acceso" y a dirección que buscara.
            const axiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: direccion,
                    key: googleMapsApiKey,
                },
            });

            // Condición que muestrara los resultados de la consulta o si currio un fallo.
            if (axiosResponse.data.status === 'OK') 
            {
                const location = axiosResponse.data.results[0].geometry.location;

               // Mostramos el resutlado exítoso en el navegador en formato Json. 
                response.json({
                    success: true,
                    latitud: location.lat,
                    longitud: location.lng,
                });

                const lat = location.lat;
                const long = location.lng;

                // Al finalizar la consulta, se registra un anuncio mediante los metodos de "controles_anuncios" (Con los parametros: direccion, latitud y longitud) en la base de datos.
                await controles_anuncios.put_anuncios_direccion(request, response, id_anuncio,id_usuario, direccion, lat, long);
            } 
            else 
            {
                // Mostramos el resutlado negativo en el navegador en formato Json.
                return response.json({ success: 'error' });
            }
        }
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        console.error(error);
        return response.status(500).json({ success: 'error' });
    }  
};

const get_coordenadas = async (request, response) => {
    const googleMapsApiKey = 'AIzaSyAJKhEZG06SRCHgQQiuv1fncdI-FUsj_PE';

    try {
        const { direccion } = request.params;

        // Validación para comprobar existencia de datos.
        if (!direccion) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese una dirección." });
        }

        // Realización de la consulta a la API de Google Maps.
        const axiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: direccion,
                key: googleMapsApiKey,
            },
        });

        // Condición que mostrará los resultados de la consulta o si ocurrió un fallo.
        if (axiosResponse.data.status === 'OK') {
            const location = axiosResponse.data.results[0].geometry.location;

            // Enviamos una única respuesta con las coordenadas.
            response.json({
                success: true,
                latitud: location.lat,
                longitud: location.lng,
            });
        } else {
            // Mostramos el resultado negativo en el navegador en formato Json.
            response.status(500).json({ success: 'error' });
        }
    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.error(error);
        response.status(500).json({ success: 'error' });
    }
};

// Petición asincrona para la creacion de un anuncio mediante su dirección y coordenadas.
const post_coodenadas_bd = async (request, response, id_usuario,direccion,latitud, longitud) => {
    try {
        // Validación para comprobar la existencia de datos.
        if ( id_usuario == undefined || direccion == undefined || latitud == undefined || longitud == undefined ) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Almacenamos las variables que se registrarán en la base de datos.
        const datos = { id_usuario, direccion, latitud, longitud};

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        const conexion = await get_conexion();

        // Inserción SQL en la tabla.
        const resultado = await conexion.query("INSERT INTO tab_anuncio SET ?", datos);

        console.log(resultado);
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        console.log('Error en la carga de la imagen: ' + error.message);
        return;
    }
};

// Petición asincrona para la actualizacion de dirección y coordenadas en un anuncio.
const put_coodenadas_bd = async (request, response, id_anuncio, direccion, coordenadas) => {
    try {
        // Validación para comprobar la existencia de datos.
        if (direccion == undefined || coordenadas == undefined || id_anuncio == undefined ) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Almacenamos las variables que se registrarán en la base de datos.
        const datos = { direccion, coordenadas };
        const id  = { id_anuncio };

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        const conexion = await get_conexion();

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
};


export const metodos = {
    sent_coordenadas,
    get_coordenadas
};
