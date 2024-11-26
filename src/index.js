import app from "./app.js"; // Importamos la aplicacion desde "app.js

const main = () =>{
    app.listen(app.get("port"));// Preparamos al servidor en escucha en el puerto "3000" asignado en "app"
    console.log(`Servidor en el puerto ${app.get("port")}`);// Texto que nos indica en consola donde esta corriendo el servidor.
};

main();