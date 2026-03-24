import { inicio_conexion } from "./../bd/bd_conexion.js";
import { mensaje_error, mensaje_POST, mensaje_GET, mensaje_PUT, mensaje_DELETE } from "../mensajes/mensajes_consultas.js";

// Petición asincrona de todos los favoritos.
/*const get_favoritos = async (request, response) => {
    let conexion;
    try {
        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("SELECT id_favorito, id_anuncio, id_usuario, fecha, hora FROM tab_favoritos");
        //response.json("Mensaje de prueba jsjsjsjsj");
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
*/

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
        // 1. ¡ESTA ES LA LÍNEA QUE FALTA! 
        // Extraemos los datos que envía el frontend (Angular)
        const { id_anuncio, id_usuario } = request.body;

        // 2. Validación de seguridad básica
        if (!id_anuncio || !id_usuario) {
            return response.status(400).json({ message: "Faltan datos en la petición." });
        }

        conexion = await inicio_conexion();

        // 3. Ejecutamos la consulta para ver si ya existe
        const resultadoBusqueda = await conexion.query(
            "SELECT * FROM tab_favoritos WHERE id_anuncio = ? AND id_usuario = ?",
            [id_anuncio, id_usuario]
        );

        // 4. Extraemos las filas de forma segura
        const filas = Array.isArray(resultadoBusqueda) ? resultadoBusqueda[0] : resultadoBusqueda;

        // 5. Lógica de Toggle (Quitar o Poner)
        if (filas && filas.length > 0) {
            // Si ya existe, DELETE
            await conexion.query(
                "DELETE FROM tab_favoritos WHERE id_anuncio = ? AND id_usuario = ?",
                [id_anuncio, id_usuario]
            );
            return response.json({ message: "Eliminado de favoritos", estado: false });
        } else {
            // Si no existe, INSERT
            const nuevoFavorito = { id_anuncio, id_usuario };
            await conexion.query("INSERT INTO tab_favoritos SET ?", nuevoFavorito);
            return response.json({ message: "Agregado a favoritos", estado: true });
        }

    } catch (error) {
        console.error("Error en post_favorito:", error);
        return response.status(500).json({ message: "Error interno del servidor", error: error.message });
    } finally {
        if (conexion) await conexion.end(); // Siempre cerrar la conexión
    }
};


// Petición asincrona para eliminar un anuncio de favoritos.
const delete_favorito = async (request, response) => {
    let conexion;
    try {
        console.log(request.params)
        const { id } = request.params;

        // Validación para comprobar existencia de datos.
        if (id == undefined) {
            response.status(400).json({ message: "SOLICITUD NO VÁLIDA: Por favor ingrese el 'id' del anuncio." });
        }

        // Conexón al servidor "await" indica que debe esperar que se complete esta seccion del código para continuar.   
        conexion = await inicio_conexion();
        // Consulta SQl a la tabla. 
        const resultado = await conexion.query("DELETE FROM tab_favoritos WHERE id_favorito = ?", id); // Aquí se hace una consulta y se agrega una condicion que comprar con el valor mandado como parametro en el url.
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
    get_favoritos,
    //get_favorito,
    post_favorito,
    delete_favorito
};
