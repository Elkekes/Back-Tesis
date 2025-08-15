import app from "./app.js"; // Importamos la aplicacion desde "app.js
import { inicio_conexion } from "./bd/bd_conexion.js";

const main = () =>{
    try {
        app.listen(app.get("port"));// Preparamos al servidor en escucha en el puerto "4000" asignado en "app"
        console.log(`✅ Servidor corriendo en el puerto ${app.get("port")}.`);// Texto que nos indica en consola donde esta corriendo el servidor.

        inicio_conexion(); // Llamamos la constante de conexión para verificar la conexion con la Base de datos;
    } catch (error){
        console.error("❌ Error al iniciar el servidor:", error.message);
    }
    
    
};

main();