# Prompts Optimizados para Copilot SDK

## 📝 Plantilla: Generar un CRUD Completo

Cuando necesites un CRUD nuevo, copia este prompt y personaliza:

```
Genera un CRUD completo para el recurso de [NOMBRE_RECURSO] con Express.js, Prisma y JavaScript.

ESTRUCTURA MVC ESTRICTA:

**Controller** (src/controllers/[nombre]Controller.js):
- Métodos: getAll, getById, create, update, patch, delete
- SOLO maneja req/res HTTP, NO contiene lógica de negocio
- try/catch para todas las operaciones async
- Responde con res.status().json()
- Llama al servicio para lógica de negocio

**Service** (src/services/[nombre]Service.js):
- Métodos: getAll, getById, create, update, patch, delete
- NO conoce req ni res
- Contiene lógica de negocio, validaciones, transformaciones
- Llama a Prisma para acceso a datos
- Lanza excepciones de src/errors/ para errores

**Router** (src/routes/[nombre]Router.js):
- Define endpoints REST en /api/v1/[nombres]
- GET, POST, PUT, PATCH, DELETE
- Encadena: validación middleware → autenticación → controlador
- Importa validaciones y controller

VALIDACIÓN (express-validator):
- Crear: validación completa
- Update: validación completa
- Patch: validación opcional (no todos los campos)
- Middleware validate.js ejecuta validationResult()

RESPUESTAS ESTÁNDAR:

Éxito (200, 201):
{
  "data": { ...resultado },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

Error (422, 400, 401, 404, 409):
{
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE"
  }
}

CODIGOS HTTP OBLIGATORIOS:
- 200 OK
- 201 Created (POST)
- 204 No Content (DELETE)
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity
- 500 Internal Server Error

IMPORTACIONES NECESARIAS:
- Errores: NotFoundError, ConflictError, ValidationError, UnauthorizedError
- Validación: body, param, query (express-validator)
- Middleware: validate (src/middlewares/validate.js)

DOCUMENTACION JSDoc:
- Comentarios /** */ para cada función
- @param, @returns, @throws
- Swagger tags: @tags [Recurso]
- Swagger paths: @routes GET/POST/PUT/PATCH/DELETE

PRUEBAS (Jest + Supertest):
- Archivo: tests/routes/[nombre]Router.test.js
- Tests para cada endpoint
- Casos: éxito, inválido (422), no autorizado (401), no encontrado (404)
- beforeAll/afterAll para setup/teardown de BD
- Cobertura mínima 80%

ESTRUCTURA BASE DEL ARCHIVO PRISMA SCHEMA:
model [Recurso] {
  id        Int     @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... campos específicos
}
```

## 📝 Plantilla: Generar Solo Validación

```
Genera validaciones con express-validator para [RECURSO]:

Campos a validar:
- [campo1]: [tipo], [restricciones]
- [campo2]: [tipo], [restricciones]

REGLAS:
- .trim() para strings
- .escape() para prevenir XSS
- Mensajes en español
- isLength({ min, max }) para validar longitud
- isEmail() y .normalizeEmail() para emails
- isAlphanumeric(), isNumeric(), matches() según formato
- custom() para validaciones complejas

FORMATO DE SALIDA:
export const validate[Recurso] = [
  body('[campo]')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Mensaje en español'),
  // más validaciones...
];

Exporta como array listo para middleware.
```

## 📝 Plantilla: Generar Tests

```
Genera tests de Jest + Supertest para los endpoints de [RECURSO].

ESTRUCTURA:
- Describe block principal: describe('GET /api/v1/[recursos]', () => {})
- beforeAll: conectar a BD test, crear fixtures
- afterAll: limpiar datos de test, cerrar conexión
- Cada test case: describe/it para caso específico

CASOS MÍNIMOS:
1. Éxito - retorna 200 con datos válidos
2. Éxito - retorna 201 cuando crea recurso
3. Inválido - retorna 422 si faltan campos requeridos
4. Inválido - retorna 422 si campos no cumplen validación
5. No autorizado - retorna 401 si no hay token
6. No encontrado - retorna 404 si recurso no existe
7. Conflicto - retorna 409 si ya existe (si aplica)

VALIDACIONES EN TESTS:
- Verificar status code
- Verificar estructura de respuesta { data, error, meta }
- Verificar campos en data
- Verificar tipo de datos
- NO hardcodear IDs, usar fixtures

FIXTURES:
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'SecurePass123'
};

CLEANUP:
- Borrar datos creados en tests
- Usar afterEach() para limpiar entre tests
```

## 📝 Plantilla: Generar Documentación Swagger

```
Genera documentarios JSDoc con swagger-jsdoc para el endpoint [RUTA].

FORMATO:
/**
 * @openapi
 * /api/v1/[recursos]:
 *   get:
 *     summary: Descripción corta
 *     description: Descripción detallada
 *     tags:
 *       - [Nombre Recurso]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *               example:
 *                 data: [...]
 *       400:
 *         description: Error de validación
 */
function getAll(req, res, next) {
  // ...
}
```

## 🎯 Casos de Uso Comunes

### Agregar nuevo endpoint a recurso existente

```
Agrega el endpoint POST /api/v1/[recursos]/bulk-create
que acepta un array de objetos y crea múltiples registros.

Responde con array de creados y array de errores por item.
Estructura: { data: { created: [], errors: [] }, meta: { total } }
```

### Agregar filtrado avanzado

```
Agrega filtrado a GET /api/v1/[recursos] con:
- Filtrar por campos específicos (?field1=value&field2=value)
- Ordenar (?sort=field&order=asc|desc)
- Búsqueda de texto (?search=término)
- Paginación (?page=1&limit=20)

Implementa en el servicio, valida en el controlador.
```

### Agregar autorización (ownership check)

```
En [recurso]Service, agrega verificación de ownership.

Antes de actualizar/eliminar, verifica que req.user.id === recurso.userId
Si no coincide, lanza ForbiddenError.

Actualiza el controlador para pasar req.user al servicio.
```
