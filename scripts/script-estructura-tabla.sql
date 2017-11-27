CREATE DATABASE queVeoHoy;

USE queVeoHoy;

CREATE TABLE pelicula (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    duracion INT,
    director VARCHAR(400),
    anio INT,
    fecha_lanzamiento DATE,
    puntuacion INT,
    poster VARCHAR(300),
    trama VARCHAR(700)
);

CREATE TABLE genero(
		id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL
);


ALTER TABLE pelicula ADD COLUMN genero_id VARCHAR(30);

ALTER TABLE pelicula ADD FOREIGN KEY (genero_id) REFERENCES genero(id);


CREATE TABLE actor(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(70) NOT NULL
);

CREATE TABLE actor_pelicula(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    FOREIGN KEY (actor_id) REFERENCES actor(id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);
