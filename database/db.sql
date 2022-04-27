-- CREATE DATABASE besu44wnubq2rorv0mpw;

USE besu44wnubq2rorv0mpw;

 DROP TABLE if EXISTS tramite;
 DROP TABLE if EXISTS doc_ente;
 DROP TABLE if EXISTS expediente;
 DROP TABLE if EXISTS gestor;
 DROP TABLE if EXISTS documento;
 DROP TABLE if EXISTS tipo_expediente;
 DROP TABLE if EXISTS movimiento;
 DROP TABLE if EXISTS tipo_tramite;
 DROP TABLE if EXISTS usuario;
 DROP TABLE if EXISTS departamento;
 DROP TABLE if EXISTS tipo_usuario;
 DROP VIEW if EXISTS bandejaTramitesRealizados;
-- create timestamp NOT NULL default CURRENT_TIMESTAMP

CREATE TABLE tipo_usuario(
	id_TipoUsr TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_tipo VARCHAR(10) NOT NULL
);

CREATE TABLE departamento(
	id_Depto TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre VARCHAR(30) NOT NULL,
	horario VARCHAR(15) NOT NULL
);
INSERT INTO departamento VALUES 
(NULL,"alcaldía","5 a 7"),
(NULL,"gerencia","5 a 7"),
(NULL,"tesorería","5 a 7"),
(NULL,"secretaría","5 a 7");

CREATE TABLE gestor(
	DNI VARCHAR(8) PRIMARY KEY NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellido_paterno VARCHAR(15) NOT NULL,
	apellido_materno VARCHAR(15) NOT NULL,
	correo VARCHAR(30) NOT NULL,
	contrasena VARCHAR(100) NOT NULL,
	id_Depto TINYINT NOT NULL,
	CONSTRAINT ´fk_id_Depto´  FOREIGN KEY (id_Depto) REFERENCES departamento (id_Depto)
);

CREATE TABLE tipo_tramite(
	id_TipoTramite INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
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
INSERT INTO tipo_expediente VALUES (NULL,"carta"),(NULL,"oficio"),(NULL,"solicitud");

CREATE TABLE documento(
	id_Documento INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	ruta VARCHAR(800) NOT NULL,
	nombre VARCHAR(200) NOT NULL
);

CREATE TABLE usuario(
	DNI VARCHAR(8) PRIMARY KEY NOT NULL,
	nombre VARCHAR(25) NOT NULL,
	apellido_paterno VARCHAR(15) NOT NULL,
	apellido_materno VARCHAR(15) NOT NULL,
	telefono VARCHAR(9),
	distrito VARCHAR(20),
	provincia VARCHAR(20),
	calle VARCHAR(30),	
	contrasena VARCHAR(100) NOT NULL,
	correo VARCHAR(50) NOT NULL
);

CREATE TABLE expediente(
	id_Ente INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	nombre_Expediente VARCHAR(30) NOT NULL,
	numero_hojas INTEGER NOT NULL,
	tupa BOOLEAN,
	id_Usuario VARCHAR(8) NOT NULL,
	CONSTRAINT ´fk_id_usuario´ FOREIGN KEY (id_Usuario) REFERENCES  usuario (DNI),
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
	fecha VARCHAR(30),
	nombre_Tramite VARCHAR(30) NOT NULL,
	estado VARCHAR(15) NOT NULL,
	num_doc VARCHAR(5),
	id_Ente INTEGER NOT NULL,
	CONSTRAINT ´fk_id_Ente_tramite´ FOREIGN KEY (id_Ente) REFERENCES expediente (id_Ente),
	id_Movimiento TINYINT NOT NULL,
	CONSTRAINT ´fk_id_Movimiento´ FOREIGN KEY (id_Movimiento) REFERENCES movimiento (id_Movimiento),
	id_TipoTramite INTEGER NOT NULL,
	CONSTRAINT ´fk_id_TipoTramite´ FOREIGN KEY (id_TipoTramite) REFERENCES tipo_tramite (id_TipoTramite)
);

 CREATE VIEW bandejaTramitesRealizados
 AS
 SELECT 
	expediente.id_Usuario,
	tramite.num_doc,
	tramite.fecha,
	documento.nombre,
	documento.ruta,
	tramite.nombre_Tramite,
	expediente.numero_hojas,
	tramite.estado
 FROM tramite 
 INNER JOIN expediente 
	ON tramite.id_Ente = expediente.id_Ente
 INNER JOIN doc_ente
	ON  expediente.id_Ente = doc_ente.id_Ente
 INNER JOIN documento
	ON doc_ente.id_Documento = documento.id_Documento;