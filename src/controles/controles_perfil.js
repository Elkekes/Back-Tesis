import { inicio_conexion } from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";


// Petición asincrona de todos los perfiles de usuario.
const get_usuarios = async (request, response) => {
    let conexion;
    try {
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_usuario, nombre, apellido_1, apellido_2, correo, numero_tel, fecha_registro, hora_registro FROM tab_perfil_usuario");
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    } catch (error) {
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Método para optener datos del usuario actual loggeado
const get_usuario = async (request, response) => {
    let conexion;
    try {
        // Obtener el UID del query parameter
        const { id_usuario } = request.params;

        // console.log('🔍 UID recibido:', uid); // Para debug

        if (!id_usuario) {
            return response.status(400).json({
                success: false,
                message: "Se requiere el UID del usuario"
            });
        }

        conexion = await inicio_conexion();

        const resultado = await conexion.query(
            `SELECT nombre, apellido_1, apellido_2, numero_tel, id_pais, id_estado 
                FROM tab_perfil_usuario WHERE id_usuario = ?`,
            [id_usuario]  // ← Buscar por UID de Firebase
        );

        // CORRECCIÓN: Manejar diferentes formatos de respuesta de la BD
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

    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({
            success: false,
            message: "Error del servidor"
        });

    } finally {
        if (conexion) await conexion.end();
    }
};

// Obtener todos los países
const get_paises = async (request, response) => {
    let conexion;
    try {
        conexion = await inicio_conexion();

        const  paises = [42, 55];

        const resultado = await conexion.query(
            "SELECT id_pais, nombre_pais, codigo FROM tab_pais WHERE id_pais IN (?)",
            [paises]
        );

        console.log('Paises: ', resultado);
        
       return mensaje_GET(response, resultado);
    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({
            success: false,
            message: "Error cargando países"
        });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Obtener estados por país
const get_estados_por_pais = async (request, response) => {
    let conexion;
    try {
        const { idPais } = request.params;

        console.log("Pais seleccionado: ", idPais);
        conexion = await inicio_conexion();
        const resultado = await conexion.query(
            "SELECT id_estado, id_pais, nombre_estado FROM tab_estado WHERE id_pais = ?",
            [idPais]
        );

        return mensaje_GET(response, resultado);

    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({
            success: false,
            message: "Error cargando estados"
        });
    } finally {
        if (conexion) await conexion.end();
    }
};


// Petición asincrona para actualizar el perfil de un usuario.
const post_perfil = async (request, response) => {
    let conexion;
    try {
        // Creamos  las variables que se actualizarán en la base de datos
        const { id_usuario } = request.params;

        // Validación para comprobar existencia de datos
        if (id_usuario == undefined) {
            response.status(500).json({ message: "SOLICITUD NO VÁLIDA: PORFABOR INGRESE TODOS LOS DATOS." });
        }

        // Almacenamos las variables que se actualizarán en la base de datos.
        const perfil = { id_usuario };

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("POST tab_perfil_usuario SET ? ", [id_usuario]);

        // Mostramos el resutlado en el navegador en formato Json.
        return mensaje_POST(response, resultado);


    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al registrar el nuevo usuario. ", error);
    }
    finally {
        //si la conexion esta abierta, entonces la cerramos
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

// Petición asincrona para actualizar un anuncio exeptuando la direccón.
const put_usuario_actual = async (request, response) => {
    let conexion;
    // Asignamos el id del anuncio proporcionado en la URl.
    const { id_usuario } = request.body;

    const body = request.body;
    const usuario = {};

    try {
        const camposPermitidos = [ 'nombre', 'apellido_1', 'apellido_2', 'numero_tel', 'id_pais', 'id_estado'];

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined) {
            response.status(500).json({ 
                success: false,
                message: "SOLICITUD NO VÁLIDA: IDENTIFICADOR DE USUARIO INVÁLIDO." 

            });
        }

        // Creamos  las variables que se actualizarán en la base de datos. Solo agregamos al objeto lo que realmente viene en el request.
        for (const key in body) {
            if (camposPermitidos.includes(key) && body[key] !== undefined && body[key] !== null) {
                usuario[key] = body[key];
            }
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        //Actualización SQl a la tabla. 
        const resultado = await conexion.query("UPDATE tab_perfil_usuario SET ? WHERE id_usuario = ?", [usuario, id_usuario]);

        // Verificamos si se actualizó algún registro.
        return mensaje_PUT(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error en la actrualización del perfil. ", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};


// Petición asincrona para eliminar solo un usuario.
const delete_perfil = async (request, response) => {
    let conexion;
    try {
        const { id } = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined) {
            response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese todos los datos." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_perfil_usuario WHERE id_usuario = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        console.log(resultado);
        // Mostramos el resutlado en el navegador en formato Json.
        response.json(resultado);
    } catch (error) {
        // Código de respuesta hhtp:  Errores de los servidores. 
        response.status(500);
        response.send(error.messaje);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};

export const metodos = {
    get_usuarios,
    get_usuario,
    get_paises,
    get_estados_por_pais,
    post_perfil,
    put_usuario_actual,
    delete_perfil
};
