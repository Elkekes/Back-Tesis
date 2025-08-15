import mysql from "promise-mysql";
// Importamos las credenciales de conexión.
import config from "./../config.js";

let conexion;

// Constante que inicializara la conexión asincorna con la BDD. 
const inicio_conexion = async () => {
    //Manejador de errores en caso de falla en la conexión con la base de datos.
    try {
        conexion = await mysql.createConnection({
        // Asignamos las variables de conexión importadas desde config.js.
        host: config.host,
        database: config.database,
        user: config.user,
        password: config.password
    });
    console.log("✅ Conexión establecida con RDS.");
    return conexion; // Retorno la conexión para las consultas.
    
    } catch (error) {   
        console.error("❌ Error al conectar con la base de datos:", error.message), ".";
        throw error; // Manda el error para que manejo en main.js
    }   
    
};

// Exportamos la funcionde inicio de conexion para que pueda ser usada en otras partes del back-end
export { inicio_conexion };