import { error, log } from "console";
import { get_conexion } from "../bd/bd_conexion.js";

import fs from "fs";

const path = require('path');
const { unlink } = require('fs').promises;
//const { get_conexion } = require('../db.js');

// Petición asincrona de todas las imagenes relacionadas a un anuncio.
const get_imagenes = async(request, response) =>
{
    try{
        console.log(request.params)
        const {id} = request.params;
        // Validación para comprobar existencia de datos.
        if (!id) {
            return response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_imagen,num_imagen,direccion_imagen  FROM tab_anuncio_imagen WHERE id_anuncio = ? ", id );
    
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.menssage);
    }  
};

// Petición asincrona de la imagen principal relacionada a un anuncio.
const get_imagen_principal = async(request, response) =>
{
    try{
        console.log(request.params)
        //const {id} = request.params;
        // Validación para comprobar existencia de datos.
        //if (id == undefined )
        //{
            //response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        //}
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_imagen, id_anuncio, direccion_imagen  FROM tab_anuncio_imagen WHERE num_imagen = 1 " );
    
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};


// Petición asincrona para actualizar una imagen.
const put_imagen = async(request, response) =>
{
    try{
        //Creamos  las variables que se actualizarán en la base de datos.
        const {id_anuncio, num_imagen, direccion_imagen} = request.body;
        console.log(request.params)
        const {direccion} = request.params;

        // Validación para comprobar existencia de datos.
        if (direccion == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const imagen = {id_anuncio, num_imagen, direccion_imagen};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_anuncio_imagen SET ? WHERE direccion_imagen = ?", [imagen, direccion]);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona para eliminar un sola image
const delete_imagen = async (request, response) => {
    try {
        const url = request.query.url;
        if (!url)
            return response.status(400).json({ error: 'Falta el parametro url' });

        // Ruta absoluta usando import.meta.url (ES Modules)
            //const __filename = fileURLToPath(import.meta.url);
            //const __dirname = path.dirname(__filename);
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', path.basename(url));

        try {
            await unlink(imagePath);
            console.log("archivo borrado: ", imagePath);
        } catch (err) {
            console.warn("No se pudo borrar el archivo (puede que no exista):", err.message);
        }

        const conexion = await get_conexion();
        const resultado = await conexion.query("DELETE FROM tab_anuncio_imagen WHERE direccion_imagen = ?", [url]);

        if (resultado.affectedRows === 0) {
            return response.status(404).json({ message: "No se encontró la imagen en la base de datos." });
        }

        return response.status(200).json({ message: "Imagen eliminada exitosamente.", resultado });
    } catch (error) {
        console.error("error en delete_imagen: ", error);
        return response.status(500).json({ error: "Error al eliminar la imagen.", detalle: error.message });
    }
};


const post_imagen_bd = async (request, response, nombreImagen, id_anuncio, num_imagen) => {
    try {
        if (!validarParametros(id_anuncio, num_imagen, nombreImagen)) 
            return response.status(400).json({
                success: false,
                message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos requeridos."
        });
        
        const direccion_imagen = `/uploads/${nombreImagen}`;
        const imagen = { id_anuncio, num_imagen, direccion_imagen };
        
        const conexion = await get_conexion();
        const resultado = await conexion.query("INSERT INTO tab_anuncio_imagen SET ?", imagen);

        // Confirmar éxito en la inserción
        console.log("Imagen guardada correctamente en BD: ", imagen);

        return response.json({ success: true, message: "Imagen subida correctamente.", data: resultado });
    
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        console.error("Error al guardar la imagen en BD:", error);
        return response.status(500).json({ success: false, message: "Error en la carga de la imagen", error: error.message });
    }
};

const validarParametros = (id_anuncio, num_imagen, nombreImagen) => {
    return id_anuncio && num_imagen && nombreImagen;
}

// Petición asincrónica para subir una imagen al servidor.
const post_imagen_serv = async (request, response) => {
    try {
        /*
            console.log('Solicitud recibida:', request); // Registra toda la solicitud recibida

            console.log('Archivos recibidos:', request.files); // Registra los archivos recibidos

            // Obtención del nombre de la imagen subida.
            const nombreImagen = request.file.filename;
            console.log("nombre imagen:" + nombreImagen );
            const id_anuncio = request.params.id_anuncio;
            const num_imagen = request.params.num_imagen;

            // llamamos al Método 2 para guardar la información en la base de datos.
            await post_imagen_bd(request, response,nombreImagen, id_anuncio, num_imagen);
        */
        
        console.log("Solicitud recibida para subir imagen:", request.params);

        if (!request.file) {
            return response.status(400).json({ success: false, message: "No se recibió ninguna imagen." });
        }

        const nombreImagen = request.file.filename;
        const { id_anuncio, num_imagen } = request.params;

        if (!id_anuncio || !num_imagen) {
            return response.status(400).json({ success: false, message: "Faltan parámetros en la solicitud." });
        }

        await post_imagen_bd(request, response, nombreImagen, id_anuncio, num_imagen);

    } catch (error) {
        /*
        console.log('Solicitud recibida:', request); // Registra toda la solicitud recibida
        console.log('Archivos recibidos:', request.files); // Registra los archivos recibidos

        // Código de respuesta HTTP: Errores de los servidores.
        response.status(500).send('Error en la carga de la imagen: ' + error.message);
        return;*/

        console.error("Error en post_imagen_serv: ", error);
        return response.status(500).json({ success: false, message: "Error en la carga de la imagen: ", error: error.message });
    }
};

export const metodos = {
    get_imagenes,
    get_imagen_principal,
    post_imagen_serv,
    put_imagen,
    delete_imagen,
};
