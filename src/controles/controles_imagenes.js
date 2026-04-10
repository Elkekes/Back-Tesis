import {inicio_conexion} from "../bd/bd_conexion.js";


/*Declaracion Costante que que sirve para trabajar con rutas de archivos y
directorios de manera segura, independiente del sistema operativo.*/ 
const path = require('path')

//Declaración del eliminador archivos de manera asíncrona usando.
const { unlink } = require('fs').promises;

// Petición asincrona de todas las imagenes relacionadas a un anuncio.
const get_imagenes = async(request, response) =>
{
    let conexion;
    try{
        console.log(request.params)
        const {id} = request.params;
        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
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
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }   
};

// Petición asincrona de la imagen principal relacionada a un anuncio.
const get_imagen_principal = async(request, response) =>
{
    let conexion;
    try{
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
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
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }   
};



// Petición asincrona para actualizar una imagen.
const put_imagen = async(request, response) =>
{
    let conexion;
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
        conexion = await inicio_conexion();
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
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    }   
};

// Petición asincrona para eliminar un solo anuncio.
const delete_imagen = async(request, response) =>
{
    let conexion;
    try {
        const url = request.query.url;
        if (!url){
            return response.status(400).json({ error: 'Falta el parametro url' });
        }
        
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', path.basename(url));

        try {
            await unlink(imagePath);
            console.log("archivo borrado: ", imagePath);
        } catch (err) {
            console.warn("No se pudo borrar el archivo (puede que no exista):", err.message);
        }

        conexion = await inicio_conexion();
        const resultado = await conexion.query("DELETE FROM tab_anuncio_imagen WHERE direccion_imagen = ?", [url]);

        if (resultado.affectedRows === 0) {
            return response.status(404).json({ message: "No se encontró la imagen en la base de datos." });
        }

        return response.status(200).json({ message: "Imagen eliminada exitosamente.", resultado });
    } catch (error) {
        console.error("error en delete_imagen: ", error);
        return response.status(500).json({ error: "Error al eliminar la imagen.", detalle: error.message });
    }
    finally {
    if (conexion) await conexion.end(); // Cierre de la conexión.
    } 
};

//Procedimiento que realiza la petición para guardar en base de datos información de una imagen.
const post_imagen_anuncio = async (request, response) => {
    let conexion;
    try {
        const { id_anuncio } = request.body;

        // Validación de datos
        if (!id_anuncio) {
            return response.status(400).json({
                success: false,
                message: "Falta el id_anuncio."
            });
        }

        // Verificamos que llegaron archivos
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({
                success: false,
                message: "No se recibieron imágenes."
            });
        }

        conexion = await inicio_conexion();

        // Procesamos cada imagen recibida
        const resultados = [];
        for (let i = 0; i < request.files.length; i++) {
            const archivo       = request.files[i];
            const nombreImagen  = archivo.filename; // Nombre único generado por multer
            const direccion_imagen = `/uploads/${nombreImagen}`;
            const num_imagen    = i + 1; // Número de imagen (1, 2, 3...)

            console.log(`Guardando imagen ${num_imagen}:`, nombreImagen);

            const imagen = { id_anuncio, num_imagen, direccion_imagen };
            const resultado = await conexion.query(
                "INSERT INTO tab_anuncio_imagen SET ?", imagen
            );

            resultados.push(resultado);
        }

        return response.json({
            success: true,
            message: `${request.files.length} imagen(es) subidas correctamente.`,
            data: resultados
        });

    } catch (error) {
        console.error("Error al guardar imágenes:", error);
        return response.status(500).json({
            success: false,
            message: "Error al guardar las imágenes.",
            error: error.message
        });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Petición asincrónica para subir una imagen al servidor.
const post_imagen_serv = async (request, response,) => {
     try {
        console.log("Solicitud recibida para subir imagen:", request.params);

        if (!request.file) {
            return response.status(400).json({ success: false, message: "No se recibió ninguna imagen." });
        }

        const nombreImagen = request.file.filename;
        const { id_anuncio, num_imagen } = request.params;

        if (!id_anuncio || !num_imagen) {
            return response.status(400).json({ success: false, message: "Faltan parámetros en la solicitud." });
        }

        //Llamada al procedimiento que realiza la inserción de datos en la BD.
        await post_imagen_bd(request, response, nombreImagen, id_anuncio, num_imagen);

    } catch (error) {
        console.error("Error en post_imagen_serv: ", error);
        return response.status(500).json({ success: false, message: "Error en la carga de la imagen: ", error: error.message });
    }
};


export const metodos = {
    get_imagenes,
    get_imagen_principal,
    post_imagen_anuncio,
    put_imagen,
    delete_imagen,
};
