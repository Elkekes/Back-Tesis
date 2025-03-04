import {get_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos los anuncios.
const get_anuncios = async(request, response) =>
{
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_anuncio,titulo,descripcion, precio,fecha_inicio,fecha_fin,direccion,direccion_imagen,id_alojamiento  FROM vista_card_anuncios");
        //response.json("Mensaje de prueba jsjsjsjsj");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona de anuncios incompletos los anuncios.
const get_anuncios_incompletos = async(request, response) =>
{
    const {id_usuario} = request.params;
    try{
        // Validación para comprobar la existencia de datos.
        if ( id_usuario == undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_anuncio,titulo,descripcion,num_habitaciones,num_camas,num_banos,id_alojamiento,precio,fecha_inicio,fecha_fin,direccion,latitud,longitud FROM tab_anuncio WHERE id_usuario = ? AND " +
        "(titulo IS NULL OR descripcion IS NULL OR num_habitaciones IS NULL OR num_camas IS NULL OR num_banos IS NULL OR id_alojamiento IS NULL OR precio IS NULL OR fecha_inicio IS NULL OR fecha_fin IS NULL OR direccion IS NULL OR  latitud IS NULL OR " +
        "longitud IS NULL);", [id_usuario]);
        //response.json("Mensaje de prueba jsjsjsjsj");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona para agregar un usuario.
const post_anuncios = async(request, response) =>
{
    const {id_usuario,id_alojamiento} = request.body;
    
    try {
        // Validación para comprobar la existencia de datos.
        if ( id_usuario == undefined || id_alojamiento == undefined ) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Almacenamos las variables que se registrarán en la base de datos.
        const datos = { id_usuario, id_alojamiento};

        // Conexión al servidor. "await" indica que debe esperar que se complete esta sección del código para continuar.
        const conexion = await get_conexion();

        // Inserción SQL en la tabla.
        const resultado = await conexion.query("INSERT INTO tab_anuncio SET ?", datos);

        console.log(resultado);
    } catch (error) {
        // Código de respuesta HTTP: Errores de los servidores.
        console.log('Error en el registro del anuncio: ' + error.message);
        return;
    }
};


// Petición asincrona para actualizar un anuncio.
const put_anuncios = async(request, response) =>
{
    try{
        //Creamos  las variables que se actualizarán en la base de datos.
        const {titulo, descripcion, num_habitaciones, num_camas, num_banos, id_alojamiento, id_usuario, precio, fecha_inicio, fecha_fin} = request.body;
        console.log(request.params)
        //Asignamos el id del anuncio proporcionado en la URl.
        const {id_anuncio} = request.params;

        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = {titulo, descripcion, num_habitaciones, num_camas, num_banos, id_alojamiento, id_usuario, precio, fecha_inicio, fecha_fin};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);
        
        // Mostramos el resutlado en el navegador en consola.
        console.log(resultado);

    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        console.log('Error en la actualización del anuncio: ' + error.message);
        return;
    }  
};

// Petición asincrona para actualizar un anuncio.
const put_anuncios_direccion = async(request, response, id_anuncio, id_usuario, direccion, latitud, longitud) => {
    try {
        console.log(request.params);

        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined || id_usuario == undefined || direccion == undefined || latitud == undefined || longitud == undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = { id_usuario, direccion, latitud, longitud };

        // Conexión al servidor.
        const conexion = await get_conexion();

        // Actualización SQL a la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);

        // Mostramos el resultado en la consola del servidor.
        console.log(resultado);

    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.log('Error en la actualización del anuncio: ' + error.message);
        return response.status(500).json({ status: 'error', message: 'Error en la actualización del anuncio.' });
    }
};


// Petición asincrona para actualizar un anuncio.
const put_tipoalojamiento = async (request, response) => {
    try {
        const { id_anuncio } = request.params;
        const { id_alojamiento } = request.body;

        // Validación para comprobar existencia de datos.
        if (id_alojamiento === undefined || id_anuncio === undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = { id_alojamiento };

        // Conexión al servidor.
        const conexion = await get_conexion();

        // Actualización SQL a la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);

        // Mostramos el resultado en la consola del servidor.
        console.log(resultado);

        // Verificamos si se actualizó algún registro.
        if (resultado.affectedRows > 0) {
            return response.status(200).json({ status: 'success', message: 'Anuncio actualizado correctamente' });
        } else {
            // Si no se actualizó ningún registro, devolvemos un mensaje de error.
            return response.status(500).json({ status: 'error', message: 'No se pudo actualizar el anuncio.' });
        }
    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.log('Error en la actualización del anuncio: ' + error.message);
        return response.status(500).json({ status: 'error', message: 'Error en la actualización del anuncio.' });
    }
};

// Petición asincrona para actualizar un anuncio.
const put_cantidades = async (request, response) => {
    try {
        const { id_anuncio } = request.params;
        const { num_habitaciones, num_camas,num_banos } = request.body;

        // Validación para comprobar existencia de datos.
        if (num_habitaciones === undefined || num_camas === undefined ||num_banos === undefined || id_anuncio === undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = { num_habitaciones, num_camas,num_banos };

        // Conexión al servidor.
        const conexion = await get_conexion();

        // Actualización SQL a la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);

        // Mostramos el resultado en la consola del servidor.
        console.log(resultado);

        // Verificamos si se actualizó algún registro.
        if (resultado.affectedRows > 0) {
            return response.status(200).json({ status: 'success', message: 'Anuncio actualizado correctamente' });
        } else {
            // Si no se actualizó ningún registro, devolvemos un mensaje de error.
            return response.status(500).json({ status: 'error', message: 'No se pudo actualizar el anuncio.' });
        }
    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.log('Error en la actualización del anuncio: ' + error.message);
        return response.status(500).json({ status: 'error', message: 'Error en la actualización del anuncio.' });
    }
};

const put_descripcion = async (request, response) => {
    try {
        const { id_anuncio } = request.params;
        const { titulo,descripcion,precio } = request.body;

        // Validación para comprobar existencia de datos.
        if (titulo === undefined || descripcion === undefined || id_anuncio === undefined ||  precio === undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = { titulo,descripcion,precio };

        // Conexión al servidor.
        const conexion = await get_conexion();

        // Actualización SQL a la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);

        // Mostramos el resultado en la consola del servidor.
        console.log(resultado);

        // Verificamos si se actualizó algún registro.
        if (resultado.affectedRows > 0) {
            return response.status(200).json({ status: 'success', message: 'Anuncio actualizado correctamente' });
        } else {
            // Si no se actualizó ningún registro, devolvemos un mensaje de error.
            return response.status(500).json({ status: 'error', message: 'No se pudo actualizar el anuncio.' });
        }
    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.log('Error en la actualización del anuncio: ' + error.message);
        return response.status(500).json({ status: 'error', message: 'Error en la actualización del anuncio.' });
    }
};

const put_fecha = async (request, response) => {
    try {
        const { id_anuncio } = request.params;
        const { fecha_inicio, fecha_fin } = request.body;

        // Validación para comprobar existencia de datos.
        if (fecha_inicio === undefined || fecha_fin === undefined || id_anuncio === undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const anuncio = { fecha_inicio, fecha_fin };

        // Conexión al servidor.
        const conexion = await get_conexion();

        // Actualización SQL a la tabla.
        const resultado = await conexion.query("UPDATE tab_anuncio SET ? WHERE id_anuncio = ?", [anuncio, id_anuncio]);

        // Mostramos el resultado en la consola del servidor.
        console.log(resultado);

        // Verificamos si se actualizó algún registro.
        if (resultado.affectedRows > 0) {
            return response.status(200).json({ status: 'success', message: 'Anuncio actualizado correctamente' });
        } else {
            // Si no se actualizó ningún registro, devolvemos un mensaje de error.
            return response.status(500).json({ status: 'error', message: 'No se pudo actualizar el anuncio.' });
        }
    } catch (error) {
        // Código de respuesta HTTP: Errores del servidor.
        console.log('Error en la actualización del anuncio: ' + error.message);
        return response.status(500).json({ status: 'error', message: 'Error en la actualización del anuncio.' });
    }
};

// Petición asincrona para eliminar un solo anuncio.
const delete_anuncios = async(request, response) =>
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
        const resultado = await conexion.query("DELETE FROM tab_anuncio WHERE id_anuncio = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona de anuncios incompletos los anuncios.
const get_UltimoAnuncio = async(request, response) =>
{
    const {id_usuario} = request.params;
    try{
        // Validación para comprobar la existencia de datos.
        if ( id_usuario == undefined) {
            return response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_anuncio FROM tab_anuncio WHERE id_usuario = ? ORDER BY id_anuncio DESC LIMIT 1", [id_usuario]);
        //response.json
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona de todos los anuncios.
const get_AnuncioInfo = async(request, response) =>
{
    const {id_anuncio} = request.params;

    try{
        // Validación para comprobar existencia de datos.
        if (id_anuncio == undefined )
        {
            return response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
        }
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        const conexion = await get_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT titulo,descripcion,num_habitaciones,num_camas,num_banos,id_alojamiento,id_usuario,precio,fecha_inicio,fecha_fin,direccion,latitud,longitud  FROM tab_anuncio WHERE id_anuncio = ?",[id_anuncio]);
        //response.json("Mensaje de prueba jsjsjsjsj");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
            // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.message);
    }  
};

// Petición asincrona de todos los anuncios.
const get_AnuncioImg = async(request, response) =>
    {
        const {id_anuncio} = request.params;
    
        try{
            // Validación para comprobar existencia de datos.
            if (id_anuncio == undefined )
            {
                return response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio."});
            }
            // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
            const conexion = await get_conexion();
            // Consulta SQl a la tabla. 
            const resultado = await conexion.query("SELECT id_imagen,num_imagen,direccion_imagen FROM tab_anuncio_imagen WHERE id_anuncio = ?",[id_anuncio]);
            //response.json("Mensaje de prueba jsjsjsjsj");
            console.log(resultado);
            // Mostramos el resutlado en el navegador en formato Json.
            response.json(resultado);
        }catch(error){
                // Código de respuesta hhtp:  Errores de los servidores. 
            response.status(500);
            response.send(error.message);
        }  
    };

// Petición asincrona de todos los hospedajes publicados por un usuario.
const get_publicaciones = async(request, response) =>
    {
        const {id_usuario} = request.params;
    
        try{
            // Validación para comprobar existencia de datos.
            if (id_usuario == undefined )
            {
                return response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del usuario."});
            }
            // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
            const conexion = await get_conexion();
            // Consulta SQl a la tabla. 
            const resultado = await conexion.query("SELECT titulo, num_habitaciones, precio, direccion FROM tab_anuncio WHERE id_usuario = ?",[id_usuario]);
            //response.json("Mensaje de prueba jsjsjsjsj");
            console.log(resultado);
            // Mostramos el resutlado en el navegador en formato Json.
            response.json(resultado);
        }catch(error){
                // Código de respuesta hhtp:  Errores de los servidores. 
            response.status(500);
            response.send(error.message);
        }  
    };   
export const metodos = {
    get_anuncios,
    get_anuncios_incompletos,
    put_anuncios,
    put_anuncios_direccion,
    put_tipoalojamiento,
    put_cantidades,
    put_descripcion,
    put_fecha,
    post_anuncios,
    delete_anuncios,
    get_UltimoAnuncio,
    get_AnuncioInfo,
    get_AnuncioImg,
    get_publicaciones 
};
