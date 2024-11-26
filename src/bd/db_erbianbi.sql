CREATE DATABASE If NOT EXISTS erbianbi;

USE erbianbi;

CREATE TABLE perfil_usuario(
    id INT NOT NULL AUTO_INCREMENT,
    num_usuario INT(20) DEFAULT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_1 VARCHAR(100) NOT NULL,
    apellido_2 VARCHAR(100) DEFAULT NULL,
    numero_tel VARCHAR(10) DEFAULT NULL,
    nick_name VARCHAR(20) NOT NULL,
    correo VARCHAR(200) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    hora_registro  TIME NOT NULL,
    fecha_registro DATE,
    ultimo_log DATETIME,
    pais DEFAULT NULL,
    region DEFAULT NULL,
    ciudad DEFAULT NULL,
    colonia DEFAULT NULL,
    calle DEFAULT NULL,
    num_ext DEFAULT NULL,
    num_int DEFAULT NULL,
    PRIMARY KEY (num_usuario)
);

DESCRIBE perfil_usuario;

