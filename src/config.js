import {config} from "dotenv";

config();// Permite utilizar las variables de entorno declaras en el archivo ".env".

export default{
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.DB_USER || "",
    password: process.env.PASSWORD || "",
    googleMapsApiKey: process.env.APIKEY_GOOGLE_MAPS || "",
}