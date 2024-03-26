# Project

Este es un proyecto de backend que proporciona una API para la gestión de eventos. Los usuarios pueden crear cuentas, iniciar sesión, crear eventos y actualizar el número de participantes de los eventos.

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

POST /create-account: Crea una nueva cuenta de usuario.
POST /create-event: Crea un nuevo evento.
PUT /update-event: Actualiza el número de participantes de un evento.
DELETE /delete-event: Elimina un evento.
GET /get-all-events: Obtiene todos los eventos.