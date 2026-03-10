# Ejemplo de Uso: Generar un CRUD de Comentarios

## 📌 Descripción

Este ejemplo muestra cómo usar **GitHub Copilot SDK** para generar un CRUD completo de "Comentarios" para un POST en un blog/proyecto.

Estructura deseada:

```
GET    /api/v1/posts/:postId/comments       → Listar comentarios de un post
GET    /api/v1/posts/:postId/comments/:id   → Obtener un comentario
POST   /api/v1/posts/:postId/comments       → Crear comentario
PATCH  /api/v1/posts/:postId/comments/:id   → Editar comentario (solo propietario)
DELETE /api/v1/posts/:postId/comments/:id   → Eliminar comentario (solo propietario)
```

## 🚀 Paso 1: Copiar el Prompt al Chat de Copilot

Abre GitHub Copilot CLI o VS Code Copilot Chat y copia este prompt:

```
Genera un CRUD completo para el recurso de COMENTARIOS en un blog con Express.js,
Prisma y JavaScript.

CONTEXTO:
- Los comentarios están anidados bajo posts: /api/v1/posts/:postId/comments
- Cada comentario pertenece a un post y a un usuario
- Solo el autor puede editar/eliminar su comentario

ESTRUCTURA MVC ESTRICTA:

**Controller** (src/controllers/commentsController.js):
- Métodos: getAllByPost, getById, create, patch, delete
- SOLO maneja req/res HTTP
- Obtiene postId y commentId de req.params
- Obtiene usuarioId de req.user.id (asume autenticación)
- try/catch para todas las operaciones async
- Llama al servicio con parámetros necesarios

**Service** (src/services/commentsService.js):
- Métodos: getAllByPost, getById, create, patch, delete
- NO conoce req ni res
- Recibe parámetros: postId, commentId, userId, data
- Valida que el post exista antes de crear comentario
- Valida ownership antes de editar/eliminar
- Lanza: NotFoundError, ForbiddenError, ValidationError
- Usa Prisma para acceso a datos

**Router** (src/routes/commentsRouter.js):
- Registra rutas bajo posts:
  GET    /posts/:postId/comments
  GET    /posts/:postId/comments/:id
  POST   /posts/:postId/comments
  PATCH  /posts/:postId/comments/:id
  DELETE /posts/:postId/comments/:id
- Encadena: validación → autenticación → controlador
- Usa middleware authenticate para rutas protegidas

VALIDACIÓN (express-validator):
- CREATE: content (required, 1-5000 chars, trim, escape),
         trim()
- PATCH: content (opcional, 1-5000 chars si presente)
- Mensaje de error en español

RESPUESTAS:

Éxito GET list:
{
  "data": [
    {
      "id": 1,
      "content": "Comentario...",
      "userId": 5,
      "postId": 10,
      "createdAt": "2026-03-10T10:30:00Z",
      "updatedAt": "2026-03-10T10:30:00Z"
    }
  ],
  "meta": { "total": 25, "page": 1, "limit": 20 }
}

Éxito CREATE/PATCH:
{
  "data": { id, content, userId, postId, createdAt, updatedAt },
  "meta": { }
}

Error (404 post no existe):
{
  "error": {
    "message": "El post no existe",
    "code": "NOT_FOUND"
  }
}

Error (403 no es propietario):
{
  "error": {
    "message": "No tienes permiso para editar este comentario",
    "code": "FORBIDDEN"
  }
}

Error (422 validación):
{
  "error": {
    "message": "El contenido del comentario debe tener entre 1 y 5000 caracteres",
    "code": "VALIDATION_ERROR"
  }
}

DOCUMENTACION JSDoc:
- Comentarios /** */ para cada función
- Swagger: tags Comments, paths con operación
- Describe parameters, responses, error codes

PRUEBAS (Jest + Supertest):
- Archivo: tests/routes/commentsRouter.test.js
- Casos para cada endpoint:
  * 200 GET list
  * 200 GET by id
  * 201 POST create
  * 200 PATCH update propio
  * 403 PATCH intento de editar comentario ajeno
  * 404 GET/PATCH/DELETE id no existe
  * 404 POST a post no existente
  * 401 sin autenticación
  * 422 content vacío o inválido
- Fixtures: usuario test, post test, comentarios test
- beforeAll: seed de datos
- afterAll: cleanup

SCHEMA PRISMA (ejemplo):
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  userId    Int
  postId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}

IMPORTANTE:
- Validar que postId y userId existan
- Validar ownership ANTES de editar/eliminar
- Usar ForbiddenError si no es propietario
- Respetar paginación con limit=20
- Documentar todos los endpoints
```

## 📋 Paso 2: Esperar la Respuesta de Copilot

Copilot generará:

1. **commentsController.js** — controlador con los 5 métodos
2. **commentsService.js** — servicio con lógica de negocio
3. **commentsRouter.js** — rutas registradas bajo posts
4. **commentsRouter.test.js** — tests de integración

## ✅ Paso 3: Revisar y Adaptar

Antes de integrar, verifica:

### ✓ Controlador

- [ ] Importa servicio
- [ ] try/catch en cada método
- [ ] Obtiene parámetros de req.params, req.user, req.body
- [ ] Llama al servicio
- [ ] Responde con formato estándar
- [ ] Maneja excepciones del servicio

### ✓ Servicio

- [ ] NO conoce req ni res
- [ ] Valida ownership antes de editar/eliminar
- [ ] Lanza errores de src/errors/
- [ ] Usa Prisma para BD
- [ ] Comentarios JSDoc

### ✓ Router

- [ ] Importa commentsController
- [ ] Importa validaciones
- [ ] Encadena: validación → middleware auth → controlador
- [ ] Rutas bajo /posts/:postId/comments
- [ ] Métodos HTTP correctos

### ✓ Tests

- [ ] Fixtures con usuario, post, comentarios
- [ ] Tests para éxito y errores
- [ ] Validación de respuestas
- [ ] Cleanup en afterAll
- [ ] Cobertura ≥80%

## 🔗 Paso 4: Integrar al Proyecto

### 4.1 Actualizar Prisma Schema

Si aún no existe `Comment`, agrega:

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  userId    Int
  postId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([userId])
}

// Actualiza relación en User:
model User {
  // ... campos existentes
  comments Comment[]
}

// Actualiza relación en Post:
model Post {
  // ... campos existentes
  comments Comment[]
}
```

Luego:

```bash
npm run prisma:migrate
```

### 4.2 Copiar Archivos Generados

Copia los archivos generados por Copilot a sus ubicaciones:

```bash
# Controlador
cp generatedCommentsController.js src/controllers/commentsController.js

# Servicio
cp generatedCommentsService.js src/services/commentsService.js

# Router
cp generatedCommentsRouter.js src/routes/commentsRouter.js

# Tests
cp generatedCommentsRouter.test.js tests/routes/commentsRouter.test.js
```

### 4.3 Registrar Router Principal

En `src/routes/index.js`, agrega:

```js
import commentsRouter from './commentsRouter.js';

// En el registro de rutas:
app.use('/api/v1/posts/:postId/comments', commentsRouter);
```

### 4.4 Ejecutar Tests

```bash
npm test -- tests/routes/commentsRouter.test.js
```

Espera cobertura ≥80%.

### 4.5 Ejecutar Linter

```bash
npm run lint
```

Corrige cualquier error de estilo.

## 🧪 Paso 5: Validar Manualmente

```bash
# Iniciar servidor
npm run dev

# En otra terminal, prueba los endpoints:

# POST - Crear comentario
curl -X POST http://localhost:3000/api/v1/posts/1/comments \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Excelente post!"}'

# GET - Listar comentarios
curl http://localhost:3000/api/v1/posts/1/comments

# GET - Obtener uno
curl http://localhost:3000/api/v1/posts/1/comments/1

# PATCH - Editar (solo propietario)
curl -X PATCH http://localhost:3000/api/v1/posts/1/comments/1 \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Comentario actualizado"}'

# DELETE - Eliminar (solo propietario)
curl -X DELETE http://localhost:3000/api/v1/posts/1/comments/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

## 📊 Checklist Final

- [ ] Servicio creado en src/services/
- [ ] Controlador creado en src/controllers/
- [ ] Router creado en src/routes/ y registrado en index.js
- [ ] Tests creados en tests/routes/
- [ ] Schema Prisma actualizado
- [ ] Migración ejecutada exitosamente
- [ ] Tests pasan con ≥80% cobertura
- [ ] Linter sin errores
- [ ] Documentación Swagger generada
- [ ] Endpoints validados manualmente
- [ ] Commit con mensaje en Conventional Commits

## 💡 Próximos Pasos

Una vez completado:

1. **Agregar más funcionalidades:**
   - Paginación ordenada por fecha
   - Filtrado por rango de fechas
   - Búsqueda por contenido

2. **Agregar validaciones avanzadas:**
   - Detectar spam (mismos comentarios repetidos)
   - Limitar comentarios por usuario/hora
   - Moderar contenido profano

3. **Agregar relaciones:**
   - Respuestas a comentarios (nested comments)
   - Likes/votos en comentarios
   - Menciones de usuarios

Para cualquiera de estos, **repite el proceso** con un prompt específico.
