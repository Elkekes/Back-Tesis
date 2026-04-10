import express from "express";
import morgan from "morgan";
import path from "path";
import cors from 'cors';


// Importación de las rutas.
import rutas_perfil from "./rutas/perfil_usuario.js";
import rutas_registro from "./rutas/registro_usuario.js";
import rutas_anuncio from "./rutas/anuncios.js";
import rutas_imagenes from "./rutas/imagenes.js";
import rutas_tipo_hospedaje from "./rutas/tipo_hospedaje.js";
import rutas_favoritos from "./rutas/favoritos.js";
import rutas_historial_logs from "./rutas/historial_logs.js";
import rutas_reservacion from "./rutas/reservacion.js";
import rutas_maps from "./rutas/maps.js";
import rutas_servicios from "./rutas/servicios.js";

// Inicialización
const app = express();

// Configuraciones.
app.set("port", 4000); 

// Middlewares.
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

/*app.use(multer({
    storage: storage,
    fileFilter: fileFilter,
    dest: path.join(__dirname,'public/uploads'),
    limits: {fileSize: 5 * 1024 * 1024} // Límite de 5MB por imagen
}).single('imagen'));
*/


// Rutas.
app.use("/", rutas_perfil);
app.use("/", rutas_registro);
app.use("/", rutas_anuncio);
app.use("/", rutas_imagenes);
app.use("/", rutas_tipo_hospedaje);
app.use("/", rutas_favoritos);
app.use("/", rutas_historial_logs);
app.use("/", rutas_reservacion);
app.use("/", rutas_maps);
app.use("/", rutas_servicios);

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//{
// Archivos Estáticos que permiten relacionar con la aplicacion de angular medinte la carpeta "dist" que contiene todos los archivos.
// const rutaDist = path.join(process.cwd(), 'src/dist/angular-erbianbi');
// app.use(express.static(rutaDist));

// Manejo de rutas no definidas que permiten relacionar con la aplicacion de angular..
// app.get('*', (req, res) => {
//   res.sendFile(path.join(rutaDist, 'index.html'));
// });
//}

// Exportación de la aplicación.
export default app;