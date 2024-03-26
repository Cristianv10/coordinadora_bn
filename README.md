# Project

Este proyecto consiste en un backend desarrollado con Node.js y Express que proporciona endpoints para operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con eventos y cuentas de usuario. Utiliza una base de datos PostgreSQL para almacenar la información.


## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- JSON Web Tokens (JWT)
- Joi

## Configuración de la base de datos

Este proyecto utiliza PostgreSQL. Asegúrate de tener PostgreSQL instalado y configurado en tu máquina. La configuración de la base de datos se encuentra en el archivo `app.js`.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```bash
npm install
```

## uso 
Para iniciar el servidor, ejecuta el siguiente comando:

node app.js

## servidor y endpoints
El servidor se iniciará en http://localhost:3000.
Aquí tienes las instrucciones para consumir la API, incluyendo los endpoints disponibles, los métodos HTTP admitidos, y los headers necesarios:

   1. CREATE ACCOUNT
        POST http://localhost:3000/create-event
            Authorization: Bearer <your-token>
        Content-Type: application/json
        { "name": "Nombre del evento",
        "date": "2022-12-31T23:59:59Z",
        "city": "Nombre de la ciudad",
        "participants": 100,
        "details": "Detalles del evento",
        "user_id": 1 
        }   

   2. LOGIN 
        POST http://localhost:3000/login
        Content-Type: application/json
        { "email": "user@example.com", "password": "password" }


   3. CREATE-EVENT
        POST http://localhost:3000/create-event
        Authorization: Bearer <your-token>
        Content-Type: application/json
        { "name": "Nombre del evento",
        "date": "2022-12-31T23:59:59Z",
        "city": "Nombre de la ciudad",
        "participants": 100,
        "details": "Detalles del evento",
        "user_id": 1
        }


    4.   UPDATE-EVENT
            PUT http://localhost:3000/update-event
            Authorization: Bearer <your-token>
            Content-Type: application/json
            {"id": 1,
            "participants": 50
            }

   5.   DELETE-EVENT
    DELETE http://localhost:3000/delete-event
     Authorization: Bearer <your-token>
     Content-Type: application/json
         { "id": 1 }

   6. GET-ALL-EVENTS
        GET http://localhost:3000/get-all-events
        Authorization: Bearer <your-token>

## Scripts DDL

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    participants INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id),
    details VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);

## Scripts DML

1. CREAR CUENTA DE USUARIO:
    a.   INSERT INTO users(email, password, name) VALUES($1, $2, $3) RETURNING *

2. INICIAR SESIÓN 
    b. SELECT * FROM users WHERE email = $1 AND password = $2

3. CREAR EVENTO
    c. INSERT INTO events(name, date, city, participants, details, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *

4. ACTUALIZAR EVENTO
   d. 

5. ELIMINAR EVENTO: DELETE FROM events WHERE id = $1 RETURNING *

6. OBTENER TODOS LOS EVENTOS: SELECT * FROM events


## Modelo relacional

users
-----
id (PK)
email
name
password

events
------
id (PK)
name
city
participants
user_id (FK - users.id)
details
date