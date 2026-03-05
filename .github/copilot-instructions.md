# Instrucciones del Proyecto — REST API Node.js

## Stack Tecnológico

- **Runtime:** Node.js ≥ 18
- **Framework:** Express.js
- **Base de datos:** PostgreSQL
- **ORM:** Prisma (modo JavaScript, no TypeScript)
- **Driver directo:** node-postgres (`pg`) para autenticación y consultas complejas
- **Patrón arquitectónico:** MVC en 3 capas (controllers / services / data access)
- **Variables de entorno:** dotenv
- **Desarrollo:** Nodemon (solo devDependency, nunca en producción)

## Estructura del Proyecto

Siempre genera código siguiendo esta estructura. Nunca mezcles responsabilidades entre capas.

```
project/
├── .github/
│   └── copilot-instructions.md
├── .github/instructions/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración Prisma / pool pg
│   │   ├── passport.js          # Estrategias LocalStrategy + JWTStrategy
│   │   └── swagger.js           # Configuración OpenAPI
│   ├── controllers/             # Gestiona req/res HTTP. No contiene lógica de negocio.
│   ├── services/                # Lógica de negocio. No conoce req ni res.
│   ├── routes/                  # Define endpoints y encadena middlewares + controller
│   ├── middlewares/
│   │   ├── auth.js              # Verificación JWT y sesión
│   │   ├── validate.js          # Ejecuta express-validator y responde 422 si hay errores
│   │   └── errorHandler.js      # Middleware global de errores (4 parámetros)
│   ├── errors/                  # Clases de error personalizadas
│   ├── prisma/
│   │   └── schema.prisma
│   └── app.js                   # Configuración Express (sin app.listen)
├── generated/
│   └── prisma/                  # Cliente Prisma generado (no editar manualmente)
├── tests/
│   └── (espejo de src/)
├── .env
├── .env.test
├── .env.example                 # Sin valores reales, solo keys documentadas
├── server.js                    # Solo llama app.listen. No se prueba.
└── package.json
```

## Arquitectura MVC — Reglas Estrictas

### Controladores
- Solo gestionan el ciclo HTTP: reciben `req`, llaman al servicio, devuelven `res`.
- Nunca contienen lógica de negocio ni consultas a base de datos directas.
- Siempre usan `try/catch` en operaciones asíncronas.
- Responden con `res.status(código).json({ data, meta, error })`.

### Servicios
- Contienen toda la lógica de negocio.
- No conocen `req` ni `res`. Reciben y devuelven datos planos.
- Llaman a Prisma o a funciones del data access layer.

### Data Access (Prisma / pg)
- Solo interactúa con la base de datos.
- En `src/config/database.js` se exporta el cliente Prisma.
- Usa `process.env.NODE_ENV === 'test'` para seleccionar `TEST_DATABASE_URL`.

```js
// src/config/database.js
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

export const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });
```

## API REST — Convenciones Obligatorias

- **Versionado:** Todas las rutas inician con `/api/v1/`
- **Recursos en plural:** `/users`, `/posts`, `/comments` — nunca singular ni verbos
- **Verbos HTTP correctos:**
  - `GET` → leer (nunca modifica datos)
  - `POST` → crear
  - `PUT` → actualizar completo
  - `PATCH` → actualizar parcial
  - `DELETE` → eliminar
- **Anidamiento máximo:** 3 niveles — `/posts/:postId/comments/:commentId`
- **Filtros y paginación:** siempre por query params — `?page=1&limit=20&sort=createdAt&order=asc`
- **Respuesta estándar:**

```js
// Éxito
res.status(200).json({ data: resultado, meta: { total, page, limit } });

// Error
res.status(400).json({ error: { message: 'Descripción del error', code: 'VALIDATION_ERROR' } });
```

- **Códigos HTTP obligatorios:**
  - `200` OK, `201` Created, `204` No Content (DELETE)
  - `400` Bad Request, `401` Unauthorized, `403` Forbidden
  - `404` Not Found, `409` Conflict, `422` Unprocessable Entity
  - `500` Internal Server Error (nunca exponer stack en producción)

## Autenticación y Seguridad

- **Contraseñas:** siempre con `bcryptjs` (factor mínimo 10). Nunca texto plano.
- **Tokens:** JWT firmado con `process.env.JWT_SECRET`. Nunca hardcodear el secret.
- **Expiración:** access token `1h`, refresh token `7d` (configurable por env).
- **Passport:**
  - `LocalStrategy` para login usuario/contraseña
  - `JWTStrategy` para rutas protegidas
  - `serializeUser` guarda solo el `id` en sesión
  - `deserializeUser` recupera el usuario completo desde DB
- **`currentUser` global:**

```js
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
```

- **Nunca incluir** información sensible en la respuesta (passwords, tokens internos).
- **Headers de seguridad:** `helmet()` debe ser el **primer middleware** registrado.
- **CORS:** configurar whitelist explícita en producción, nunca `app.use(cors())` sin opciones.

## Validación y Sanitización

- Todo input de usuario **debe validarse** con `express-validator` antes de llegar al controlador.
- Usar `body()`, `param()`, `query()` según corresponda.
- El middleware `validate.js` ejecuta `validationResult()` y responde `422` si hay errores.
- En el controlador, usar `matchedData(req)` para obtener solo los datos validados.
- **Prevención XSS:** usar `.trim().escape()` en campos de texto libre.

```js
// Ejemplo de validación encadenada
export const validateUser = [
  body('username')
    .trim()
    .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números')
    .isLength({ min: 3, max: 30 }).withMessage('Debe tener entre 3 y 30 caracteres'),
  body('email')
    .trim()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];
```

## Manejo de Errores

- Clases de error personalizadas en `src/errors/`:

```js
// src/errors/AppError.js
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Error de validación') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
```

- **Middleware global de errores** — siempre al final de todos los middlewares en `app.js`:

```js
// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({ error: { message, code: err.code ?? 'INTERNAL_ERROR' } });
};
```

- Nunca usar `next(err)` con `Error` genérico si se puede usar una clase personalizada.
- Nunca exponer `err.stack` en producción.

## Testing

- **Framework:** Jest + Supertest
- **Regla:** Nunca probar `server.js`. Solo `app.js`, routers, controladores y servicios.
- **Base de datos de prueba separada:** `TEST_DATABASE_URL` en `.env.test`.
- **Script de pruebas:**

```json
"scripts": {
  "test": "NODE_ENV=test jest --setupFiles dotenv/config --coverage"
}
```

- **Cobertura mínima:** 80%
- Cada endpoint debe tener tests para: caso exitoso, input inválido (422), no autorizado (401) y no encontrado (404).

## Documentación

- Todos los endpoints documentados con comentarios JSDoc para `swagger-jsdoc`.
- Swagger UI disponible en `/api/docs` (solo en entornos no productivos).
- `README.md` debe incluir: descripción, instalación, variables de entorno requeridas y scripts npm.
- Mantener `.env.example` actualizado con **todas** las variables necesarias.

## Estilo de Código — ESLint + Prettier (Airbnb)

> ⚠️ **La configuración de ESLint y Prettier sigue el estándar Airbnb y NO debe modificarse para hacer funcionar el código.** Si el linter marca un error, el código debe corregirse para cumplir el estándar, no al revés.

### Configuración ESLint (`.eslintrc.js`)

```js
module.exports = {
  extends: ['airbnb-base'],
  env: { node: true, es2022: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    // Solo overrides justificados — NO agregar reglas para silenciar errores del código
  },
};
```

### Configuración Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### Reglas clave del estándar Airbnb que siempre deben respetarse

- `const` y `let` — nunca `var`
- Arrow functions para callbacks
- Destructuring para acceso a propiedades de objetos y arrays
- Template literals en lugar de concatenación de strings
- `import`/`export` (ES Modules) — nunca `require` salvo en archivos de configuración legacy
- Punto y coma obligatorio al final de cada sentencia
- Comillas simples en strings
- Sin variables declaradas y no usadas
- Sin `console.log` en código de producción (usar un logger como `pino`)

## Convención de Commits (Conventional Commits en Español)

> Todos los commits **deben** seguir el formato Conventional Commits. El mensaje va en **español**.

### Formato

```
<tipo>(<ámbito>): <descripción corta en imperativo>

[cuerpo opcional — explicación del por qué, no del qué]

[pie opcional — referencias a issues, breaking changes]
```

### Tipos permitidos

| Tipo       | Cuándo usarlo                                                     |
|------------|-------------------------------------------------------------------|
| `feat`     | Nueva funcionalidad para el usuario                               |
| `fix`      | Corrección de un bug                                              |
| `docs`     | Cambios solo en documentación                                     |
| `style`    | Formato, punto y coma, espacios — sin cambios en lógica           |
| `refactor` | Refactorización sin nueva funcionalidad ni corrección de bugs     |
| `test`     | Añadir o corregir tests                                           |
| `chore`    | Tareas de mantenimiento: dependencias, scripts, configuración     |
| `perf`     | Mejora de rendimiento                                             |
| `ci`       | Cambios en pipelines de CI/CD                                     |
| `revert`   | Revertir un commit anterior                                       |

### Ámbito (opcional pero recomendado)

Indica la parte del proyecto afectada: `auth`, `users`, `posts`, `db`, `config`, `middleware`, `tests`, `docs`

### Ejemplos de commits correctos

```
feat(auth): agregar endpoint de registro con hash de contraseña

fix(users): corregir error 500 al buscar usuario inexistente

refactor(posts): extraer lógica de paginación a servicio dedicado

test(auth): agregar tests de integración para login con credenciales inválidas

chore(deps): actualizar prisma a la versión 5.14

docs(api): documentar endpoints de comments con swagger-jsdoc

style(controllers): aplicar formato prettier en capa de controladores

feat(auth)!: reemplazar sesiones por autenticación JWT

BREAKING CHANGE: el endpoint /api/v1/auth/login ahora devuelve un token JWT en lugar de crear una sesión
```

### Commits incorrectos — nunca generar

```
// ❌ Sin tipo
agregar login

// ❌ En inglés
feat: add user authentication

// ❌ Vago
fix: arreglar bug

// ❌ Pasado en lugar de imperativo
feat(auth): agregué el login de usuarios

// ❌ Múltiples cambios en un commit
feat: agregar login, registro, logout y recuperación de contraseña
```

## Variables de Entorno Requeridas

Nunca hardcodear valores de configuración. Siempre leer desde `process.env`.

```env
# Servidor
NODE_ENV=development
PORT=3000

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/app_dev
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/app_test

# Autenticación
JWT_SECRET=tu_secret_muy_seguro
JWT_EXPIRES_IN=1h
SESSION_SECRET=otro_secret_muy_seguro

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://tufrontend.com
```

## Reglas Generales del Asistente

1. **Nunca sugerir modificar la configuración de ESLint o Prettier** para que el código funcione. Siempre corregir el código.
2. **Nunca hardcodear secrets, URLs de base de datos ni credenciales.**
3. **Nunca mezclar responsabilidades** entre controllers, services y data access.
4. **Siempre usar clases de error personalizadas** en lugar de `throw new Error()` genérico.
5. **Siempre validar y sanitizar** los inputs antes de pasarlos a servicios o base de datos.
6. **Nunca exponer el stack trace** en las respuestas de producción.
7. **Siempre proponer el mensaje de commit** al finalizar una tarea siguiendo la convención definida.
8. Si se genera código nuevo, **proponer también el test correspondiente.**
9. **Prisma como ORM principal.** Usar `pg` directo solo cuando Prisma no sea suficiente.
10. **Responder en español** a menos que el usuario solicite otro idioma.
