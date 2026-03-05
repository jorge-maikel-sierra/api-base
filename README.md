# REST API Node.js

API REST construida con **Express.js**, **Prisma** y **PostgreSQL**, siguiendo arquitectura MVC en 3 capas.

## Stack

- Node.js ≥ 18
- Express.js
- PostgreSQL
- Prisma ORM (JavaScript)
- Passport.js (LocalStrategy + JWTStrategy)
- Jest + Supertest

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd prueba

# 2. Instalar dependencias
npm install

# 3. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Generar el cliente Prisma
npm run prisma:generate

# 5. Ejecutar migraciones
npm run prisma:migrate
```

## Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

| Variable           | Descripción                              | Ejemplo                                      |
|--------------------|------------------------------------------|----------------------------------------------|
| `NODE_ENV`         | Entorno de ejecución                     | `development`                                |
| `PORT`             | Puerto del servidor                      | `3000`                                       |
| `DATABASE_URL`     | URL de conexión a PostgreSQL             | `postgresql://user:pass@localhost:5432/db`   |
| `TEST_DATABASE_URL`| URL de conexión a la DB de pruebas       | `postgresql://user:pass@localhost:5432/test` |
| `JWT_SECRET`       | Secret para firmar los tokens JWT        | `un_secret_muy_seguro`                       |
| `JWT_EXPIRES_IN`   | Tiempo de expiración del access token    | `1h`                                         |
| `SESSION_SECRET`   | Secret para las sesiones de Passport     | `otro_secret_seguro`                         |
| `ALLOWED_ORIGINS`  | Orígenes permitidos en CORS (separados por coma) | `http://localhost:3000`             |

## Scripts npm

| Script                  | Descripción                                         |
|-------------------------|-----------------------------------------------------|
| `npm start`             | Inicia el servidor en producción                    |
| `npm run dev`           | Inicia el servidor en modo desarrollo (nodemon)     |
| `npm test`              | Ejecuta los tests con cobertura (Jest + Supertest)  |
| `npm run lint`          | Ejecuta ESLint en `src/`                            |
| `npm run lint:fix`      | Corrige errores de ESLint automáticamente           |
| `npm run format`        | Aplica formato Prettier en `src/`                   |
| `npm run prisma:generate` | Genera el cliente Prisma                          |
| `npm run prisma:migrate`  | Ejecuta migraciones de base de datos              |
| `npm run prisma:studio`   | Abre Prisma Studio para explorar la BD            |

## Estructura del Proyecto

```
src/
├── config/          # Prisma, Passport, Swagger
├── controllers/     # Capa HTTP (req/res)
├── services/        # Lógica de negocio
├── routes/          # Definición de endpoints
├── middlewares/     # Auth, validación, errores
├── errors/          # Clases de error personalizadas
├── prisma/          # schema.prisma
└── app.js           # Configuración Express
tests/               # Espejo de src/ con *.test.js
server.js            # Punto de entrada (solo app.listen)
```

## Endpoints

| Método | Ruta                   | Descripción             | Auth |
|--------|------------------------|-------------------------|------|
| POST   | `/api/v1/auth/register`| Registrar usuario       | No   |
| POST   | `/api/v1/auth/login`   | Iniciar sesión (JWT)    | No   |
| GET    | `/api/v1/users`        | Listar usuarios         | Sí   |
| GET    | `/api/v1/users/:id`    | Obtener usuario         | Sí   |
| PATCH  | `/api/v1/users/:id`    | Actualizar usuario      | Sí   |
| DELETE | `/api/v1/users/:id`    | Eliminar usuario        | Sí   |
| GET    | `/api/v1/posts`        | Listar posts            | No   |
| GET    | `/api/v1/posts/:id`    | Obtener post            | No   |
| POST   | `/api/v1/posts`        | Crear post              | Sí   |
| PUT    | `/api/v1/posts/:id`    | Actualizar post         | Sí   |
| DELETE | `/api/v1/posts/:id`    | Eliminar post           | Sí   |

La documentación Swagger está disponible en `/api/docs` en entornos no productivos.
