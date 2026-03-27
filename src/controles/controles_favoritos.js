import { inicio_conexion } from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona para optener un anuncio a favoritos.
const get_favoritos = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id_usuario } = request.params;

        // Validación para comprobar existencia de datos.
        if (id_usuario == undefined) {
            response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
        const resultado = await conexion.query("SELECT id_anuncio,titulo,descripcion, precio, direccion, direccion_imagen, tipo_alojamiento FROM vista_anuncios_favoritos WHERE id_usuario_favorito = ?", id_usuario);
        console.log(resultado);
        //Llamado a función que muestra y envía el resultado de las consultas.
        return mensaje_GET(response, resultado);

    } catch (error) {
        //Llamado a función que muestra y envía los posibles errores.
        mensaje_error(response, "Error al obtener anuncios:", error);
    }
    finally {
        if (conexion) await conexion.end(); // Cierre de la conexión.
    }
};


// Petición asincrona para agregar un anuncio a favoritos.
const post_favorito = async (request, response) => {
    let conexion;
    try {
        // Extraemos los datos que envía el frontend (Angular)
        const { id_anuncio, id_usuario } = request.body;

        // Validación de seguridad básica
        if (!id_anuncio || !id_usuario) {
            return response.status(400).json({ message: "Faltan datos en la petición." });
        }

        conexion = await inicio_conexion();

        // Ejecutamos la consulta y guardamos el resultado en un arreglo para ver si ya existe.
        const filas = await conexion.query(
            "SELECT * FROM tab_favoritos WHERE id_anuncio = ? AND id_usuario = ?",
            [id_anuncio, id_usuario]
        );

        // Lógica de Toggle (Quitar o Poner)
        if (filas.length > 0) {
            // Si ya existe, DELETE mediante la funcion de eliminación.
            await eliminar_favorito_db(id_anuncio, id_usuario);
            return response.json({ message: "Eliminado de favoritos", success: true });
        } else {
            // Si no existe, INSERT en la tabla de favoritos
            const nuevoFavorito = { id_anuncio, id_usuario };
            await conexion.query("INSERT INTO tab_favoritos SET ?", nuevoFavorito);
            return response.json({ message: "Agregado a favoritos", success: true });
        }

    } catch (error) {
        console.error("Error en agregar a favorito:", error);
        return response.status(500).json({ message: "Error interno del servidor", error: error.message , estado: false});
    } finally {
        if (conexion) await conexion.end(); // Siempre cerrar la conexión
    }
};


// Petición asincrona para eliminar un anuncio de favoritos.
const delete_favorito = async (request, response) => {
    try {
        // Extraemos los datos que envía el frontend (Angular)
        const { id_anuncio, id_usuario } = request.body;

        // Validación de seguridad básica
        if (!id_anuncio || !id_usuario) {
            return response.status(400).json({ message: "Faltan datos en la petición." });
        }

        // Función auxiliar de eliminación.
        await eliminar_favorito_db(id_anuncio, id_usuario);

        // Respuesta de retorno por parte del servidor.
        return response.json({ message: "Anuncio eliminado de favoritos", success: true });

    } catch (error) {
        console.error("Error al eliminar anuncio de favoritos:", error);
        return response.status(500).json({ message: "Error interno del servidor", error: error.message, success: false});

    }
};


// Función auxiliar reutilizable (para eliminacion de favoritos)
const eliminar_favorito_db = async (id_anuncio, id_usuario) => {
    let conexion;
    try {
        conexion = await inicio_conexion();
        await conexion.query(
            "DELETE FROM tab_favoritos WHERE id_anuncio = ? AND id_usuario = ?",
            [id_anuncio, id_usuario]
        );
    } finally {
        if (conexion) await conexion.end();
    }
};

export const metodos = {
    get_favoritos,
    post_favorito,
    delete_favorito
};
