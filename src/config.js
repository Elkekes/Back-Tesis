import {config} from "dotenv";

config();// Permite utilizar las variables de entorno declaras en el archivo ".env".

export default{
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.DB_USER || "",        //coloco DB_USER porque me detecta el user de linux y no el del .env
    password: process.env.PASSWORD || ""
}