import {inicio_conexion} from "./../bd/bd_conexion.js";

// Petición asincrona de todos los perfiles de usuario.
const get_perfiles = async(request, response) =>
{
    let conexion;
    try{
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_usuario, nick_name, nombre, apellido_1, apellido_2, correo, numero_tel, fecha_registro, hora_registro FROM tab_perfil_usuario");
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

// Petición asincrona para optener solo un usuario.
const get_perfil = async(request, response) =>
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
        const resultado = await conexion.query("SELECT nick_name,correo, contrasena FROM tab_perfil_usuario WHERE id_usuario = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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

// Petición asincrona para actualizar el perfil de un usuario.
const put_perfil = async(request, response) =>
{
    let conexion;
    try{
        //Creamos  las variables que se actualizarán en la base de datos
        const {nick_name, nombre, apellido_1, apellido_2, numero_tel} = request.body;
        console.log(request.params)
        const {id} = request.params;

        // Validación para comprobar existencia de datos
        if (id == undefined )
        {
            response.status(400).json({message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos."});
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const perfil = {nick_name, nombre, apellido_1, apellido_2, numero_tel};

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_perfil_usuario SET ? WHERE id_usuario = ?", [perfil, id]);
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    }catch(error){
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }
    finally {
        //si la conexion esta abierta, entonces la cerramos
    if (conexion) await conexion.end(); // Cierre de la conexión.
    } 
};

// Petición asincrona para eliminar solo un usuario.
const delete_perfil = async(request, response) =>
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
        const resultado = await conexion.query("DELETE FROM tab_perfil_usuario WHERE id_usuario = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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


// En controles_perfil.js - función get_usuario_actual
const get_usuario_actual = async (request, response) => {
    let conexion;
    try {
        // Obtener el UID del query parameter
        const { uid } = request.query;
        
        // console.log('🔍 UID recibido:', uid); // Para debug
        
        if (!uid) {
            return response.status(400).json({ 
                success: false, 
                message: "Se requiere el UID del usuario" 
            });
        }
        
        conexion = await inicio_conexion();
        
        const resultado = await conexion.query(
            `SELECT id_usuario, nombre, apellido_1, apellido_2, numero_tel, id_pais, id_estado 
                FROM tab_perfil_usuario WHERE id_usuario = ?`, 
            [uid]  // ← Buscar por UID de Firebase
        );

        // ✅ CORRECCIÓN: Manejar diferentes formatos de respuesta de la BD
        let filas = [];
        
        if (Array.isArray(resultado)) {
            // Si el resultado es un array directamente
            filas = resultado;
        } else if (resultado && Array.isArray(resultado[0])) {
            // Si el resultado es [filas, metadata]
            filas = resultado[0];
        } else if (resultado && resultado.rows) {
            // Si el resultado tiene propiedad rows
            filas = resultado.rows;
        }

        if (!filas || filas.length === 0) {
            return response.status(404).json({ 
                success: false, 
                message: "Usuario no encontrado" 
            });
        }
        
        response.json({ 
            success: true, 
            data: filas[0] 
        });

    } catch(error) {
        console.error("Error:", error);
        response.status(500).json({ 
            success: false, 
            message: "Error del servidor" 
        });

    } finally {
        if (conexion) await conexion.end();
    }  
};

// ✅ Actualizar perfil del usuario actual
const put_usuario_actual = async (request, response) => {
    let conexion;
    try {
        const { id_usuario, nombre, apellido_1, apellido_2, numero_tel, id_pais, id_estado } = request.body;
        
        // ⚠️ IMPORTANTE: Validar que el usuario solo pueda actualizar su propio perfil
        // Por ahora asumimos que viene el id_usuario correcto
        
        conexion = await inicio_conexion();
        
        const [resultado] = await conexion.query(
            `UPDATE tab_perfil_usuario 
            SET nombre = ?, apellido_1 = ?, apellido_2 = ?, numero_tel = ?, id_pais = ?, id_estado = ?
                WHERE id_usuario = ?`,
            [nombre, apellido_1, apellido_2, numero_tel, id_pais, id_estado, id_usuario]
        );
        
        response.json({ 
            success: true, 
            message: "Perfil actualizado correctamente",
            data: resultado 
        });
        
    } catch(error) {
        console.error("Error:", error);
        response.status(500).json({ 
            success: false, 
            message: "Error actualizando perfil" 
        });
    } finally {
        if (conexion) await conexion.end();
    } 
};

// ✅ Obtener todos los países
const get_paises = async (request, response) => {
    let conexion;
    try {
        conexion = await inicio_conexion();
        const resultado = await conexion.query(
            "SELECT id_pais, nombre_pais, codigo FROM tab_pais"
        );
        
        console.log('Paises: ', resultado);
        let paises = [];
        if (Array.isArray(resultado))
            paises = resultado;
        else if (resultado && Array.isArray(resultado[0]))
            paises = resultado[0];

        response.json(
            {
                success: true,
                data: paises
            }
        );

    } catch(error) {
        console.error("Error:", error);
        response.status(500).json({ 
            success: false, 
            message: "Error cargando países" 
        });
    } finally {
        if (conexion) await conexion.end();
    }  
};

// ✅ Obtener estados por país
const get_estados_por_pais = async (request, response) => {
    let conexion;
    try {
        const { idPais } = request.params;
        
        conexion = await inicio_conexion();
        const [resultado] = await conexion.query(
            "SELECT id_estado, id_pais, nombre_estado FROM tab_estado WHERE id_pais = ?",
            [idPais]
        );
        
        response.json({ 
            success: true, 
            data: resultado 
        });
        
    } catch(error) {
        console.error("Error:", error);
        response.status(500).json({ 
            success: false, 
            message: "Error cargando estados" 
        });
    } finally {
        if (conexion) await conexion.end();
    }  
};


export const metodos = {
    get_perfiles,
    get_perfil,
    put_perfil,
    delete_perfil,

    get_usuario_actual,      // ← AGREGAR
    put_usuario_actual,
    get_paises,
    get_estados_por_pais
};
