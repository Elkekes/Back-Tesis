import {get_conexion} from "../bd/bd_conexion.js";

// Petición asincrona de todas las imagenes relacionadas a un anuncio.
const get_imagenes = async(request, response) =>
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

// Petición asincrona para eliminar un solo anuncio.
const delete_imagen = async(request, response) =>
{
    try{
        console.log(request.params)
        const {direccion} = request.params;

        // Validación para comprobar existencia de datos.
        if (direccion == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_anuncio_imagen WHERE direccion_imagen = ?", direccion); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

const post_imagen_bd = async (request, response,nombreImagen, id_anuncio, num_imagen) => {
    try {
        // Validación para comprobar la existencia de datos.
        if (id_anuncio == undefined || num_imagen == undefined || nombreImagen == undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Construcción de la dirección de la imagen.
        const direccion_imagen = `/uploads/${nombreImagen}`;

        // Almacenamos las variables que se registrarán en la base de datos.
        const imagen = { id_anuncio, num_imagen, direccion_imagen };

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        const conexion = await get_conexion();

        // Inserción SQL en la tabla.
        const resultado = await conexion.query("INSERT INTO tab_anuncio_imagen SET ?", imagen);

        console.log(resultado);
        // Mostramos el resultado en el navegador en formato Json.
        // response.json(resultado);
        response.json(true);
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        response.status(500).send('Error en la carga de la imagen: ' + error.message);
        return;
    }
};

// Petición asincrónica para subir una imagen al servidor.
const post_imagen_serv = async (request, response,) => {
    try {
        console.log('Solicitud recibida:', request); // Registra toda la solicitud recibida

        console.log('Archivos recibidos:', request.files); // Registra los archivos recibidos

        // Obtención del nombre de la imagen subida.
        const nombreImagen = request.file.filename;
        console.log("nombre imagen:" + nombreImagen );
        const id_anuncio = request.params.id_anuncio;
        const num_imagen = request.params.num_imagen;

        // llamamos al Método 2 para guardar la información en la base de datos.
        await post_imagen_bd(request, response,nombreImagen, id_anuncio, num_imagen);
        
        
    } catch (error) {
        console.log('Solicitud recibida:', request); // Registra toda la solicitud recibida
        console.log('Archivos recibidos:', request.files); // Registra los archivos recibidos

        // Código de respuesta HTTP: Errores de los servidores.
        response.status(500).send('Error en la carga de la imagen: ' + error.message);
        return;
    }
};


export const metodos = {
    get_imagenes,
    get_imagen_principal,
    post_imagen_serv,
    put_imagen,
    delete_imagen,
};
