import mysql from "promise-mysql";
// Importamos las credenciales de conexión.
import config from "./../config.js";

// Función que almacenara las credenciales de conexión para el servidor.
const conexion = mysql.createConnection({
    // Asignamos las variables de conexión importadas desde config.js.
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

// Función que retornala la  conexión.
const get_conexion =()=>{
    return conexion;
};

// Exportamos la conexión.
export {get_conexion};
