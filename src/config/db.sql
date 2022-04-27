CREATE DATABASE STDL;

USE STDL;

-- DROP TABLE if EXISTS tramite;
-- DROP TABLE if EXISTS doc_ente;
-- DROP TABLE if EXISTS expediente;
-- DROP TABLE if EXISTS gestor;
-- DROP TABLE if EXISTS documento;
-- DROP TABLE if EXISTS tipo_expediente;
-- DROP TABLE if EXISTS movimiento;
-- DROP TABLE if EXISTS tipo_tramite;
-- DROP TABLE if EXISTS usuario;
-- DROP TABLE if EXISTS departamento;
-- DROP TABLE if EXISTS tipo_usuario;



CREATE TABLE tipo_usuario(
	id_TipoUsr TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_tipo VARCHAR(10) NOT NULL
);

CREATE TABLE departamento(
	id_Depto TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre VARCHAR(30) NOT NULL,
	horario VARCHAR(15) NOT NULL
);

CREATE TABLE usuario(
	DNI VARCHAR(8) PRIMARY KEY NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido_paterno VARCHAR(15) NOT NULL,
	apellido_materno VARCHAR(15) NOT NULL,
	contrasena VARCHAR(100) NOT NULL,
	id_TipoUsr TINYINT NOT NULL,
	CONSTRAINT ´fk_id_TipoUsr´ FOREIGN KEY (id_TipoUsr) REFERENCES tipo_usuario (id_TipoUsr),
	id_Depto TINYINT NOT NULL,
	CONSTRAINT ´fk_id_Depto´  FOREIGN KEY (id_Depto) REFERENCES departamento (id_Depto)
);

CREATE TABLE tipo_tramite(
	id_TipoTramite INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	fecha DATE NOT NULL,
	descripcion VARCHAR(100) NOT NULL,
	id_Depto TINYINT NOT NULL,
	CONSTRAINT ´fk_id_Depto_TipoTramite´ FOREIGN KEY (id_Depto) REFERENCES departamento (id_Depto)
);

CREATE TABLE movimiento(
	id_Movimiento TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre VARCHAR(30) NOT NULL
);

CREATE TABLE tipo_expediente(
	id_TipoEnte TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_tipo VARCHAR(30)
);

CREATE TABLE documento(
	id_Documento INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_documento VARCHAR(30) NOT NULL,
	documento LONGBLOB NOT NULL,
	extension VARCHAR(4) NOT NULL
);

CREATE TABLE gestor(
	DNI VARCHAR(8) PRIMARY KEY NOT NULL,
	nombre VARCHAR(25) NOT NULL,
	apellido_paterno VARCHAR(15) NOT NULL,
	apellido_materno VARCHAR(15) NOT NULL,
	contrasena VARCHAR(100) NOT NULL,
	correo VARCHAR(30) NOT NULL	  
);

CREATE TABLE expediente(
	id_Ente INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_Expediente VARCHAR(30) NOT NULL,
	numero_hojas INTEGER NOT NULL,
	id_Gestor VARCHAR(8) NOT NULL,
	CONSTRAINT ´fk_id_gestor´ FOREIGN KEY (id_Gestor) REFERENCES  gestor (DNI),
	id_TipoEnte TINYINT NOT NULL,
	CONSTRAINT ´fk_id_TipoEnte´ FOREIGN KEY (id_TipoEnte) REFERENCES tipo_expediente (id_TipoEnte)
);

CREATE TABLE doc_ente(
	id_rel INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	id_Documento INTEGER NOT NULL,
	CONSTRAINT ´fk_id_Documento´ FOREIGN KEY (id_Documento) REFERENCES documento (id_Documento),
	id_Ente INTEGER NOT NULL,
	CONSTRAINT ´fk_id_Ente´ FOREIGN KEY (id_Ente) REFERENCES expediente (id_Ente)
);

CREATE TABLE tramite(
	id_Tramite INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_Tramite VARCHAR(30) NOT NULL,
	id_Ente INTEGER NOT NULL,
	CONSTRAINT ´fk_id_Ente_tramite´ FOREIGN KEY (id_Ente) REFERENCES expediente (id_Ente),
	id_Movimiento TINYINT NOT NULL,
	CONSTRAINT ´fk_id_Movimiento´ FOREIGN KEY (id_Movimiento) REFERENCES movimiento (id_Movimiento),
	id_TipoTramite INTEGER NOT NULL,
	CONSTRAINT ´fk_id_TipoTramite´ FOREIGN KEY (id_TipoTramite) REFERENCES tipo_tramite (id_TipoTramite)
);
