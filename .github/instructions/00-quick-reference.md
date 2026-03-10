# 🚀 Referencia Rápida - Copilot SDK

## ⚡ Comandos Rápidos

### Verificar que el SDK está instalado

```bash
copilot plugin list | grep copilot-sdk
```

### Actualizar el plugin

```bash
copilot plugin update copilot-sdk
```

### Ver información del plugin

```bash
copilot plugin info copilot-sdk
```

---

## 📋 Plantilla Mínima de Prompt

Reemplaza `[...]` con tus valores:

```
Genera un CRUD para [RECURSO] en Express.js con:

**Structure:**
- Controller: src/controllers/[recurso]Controller.js
- Service: src/services/[recurso]Service.js
- Routes: src/routes/[recurso]Router.js
- Tests: tests/routes/[recurso]Router.test.js

**Endpoints:**
GET    /api/v1/[recursos]
GET    /api/v1/[recursos]/:id
POST   /api/v1/[recursos]
PATCH  /api/v1/[recursos]/:id
DELETE /api/v1/[recursos]/:id

**Validation:** express-validator, trim + escape, español messages
**Auth:** Bearer token JWT
**Errors:** classes from src/errors/
**Responses:** { data, meta } success, { error: { message, code } } failure
**Tests:** Jest + Supertest, ≥80% coverage
**Docs:** JSDoc + swagger-jsdoc
```

---

## 🔑 Reglas Clave a Recordar

| Regla                     | Por qué                               |
| ------------------------- | ------------------------------------- |
| **MVC estricto**          | Separación clara de responsabilidades |
| **Siempre validar**       | Prevenir datos inválidos y XSS        |
| **Usar clases de error**  | Manejo consistente de excepciones     |
| **try/catch en async**    | Capturar errores inesperados          |
| **No hardcodear secrets** | Seguridad — leer de .env              |
| **Documentar endpoints**  | OpenAPI/Swagger para consumidores     |
| **Escribir tests**        | Confianza en el código                |
| **Respetar ESLint**       | Consistencia de formato               |

---

## 📁 Estructura Esperada por el SDK

```
src/
├── config/
│   ├── database.js      ← Prisma client
│   ├── passport.js      ← Auth strategies
│   └── swagger.js       ← OpenAPI config
├── controllers/         ← HTTP request handling
├── services/            ← Business logic
├── routes/
│   ├── index.js         ← Route registration
│   ├── authRouter.js
│   ├── usersRouter.js
│   ├── postsRouter.js
│   └── [recurso]Router.js
├── middlewares/
│   ├── auth.js          ← JWT verification
│   ├── validate.js      ← express-validator runner
│   └── errorHandler.js  ← Global error handler
├── errors/              ← Custom error classes
├── prisma/
│   └── schema.prisma
└── app.js               ← Express setup (no listen)

tests/
├── routes/
│   ├── authRouter.test.js
│   ├── usersRouter.test.js
│   ├── postsRouter.test.js
│   └── [recurso]Router.test.js
└── services/
    ├── authService.test.js
    ├── usersService.test.js
    ├── postsService.test.js
    └── [recurso]Service.test.js
```

---

## 🎯 Prompts Específicos

### Generar CRUD

```
Genera un CRUD para [recurso] siguiendo MVC en 3 capas.
Usa express-validator, Prisma, y JWT auth.
Tests con Jest + Supertest, ≥80% coverage.
```

### Generar Solo Validaciones

```
Genera validaciones con express-validator para [recurso]:
- [campo1]: [tipo, restricciones]
- [campo2]: [tipo, restricciones]
Usa .trim().escape(), mensajes en español.
```

### Generar Solo Tests

```
Genera tests de integración para GET /api/v1/[recursos]/:id
Cases: 200 success, 404 not found, 401 unauthorized, 422 invalid.
Usa Supertest + fixtures.
```

### Generar Documentación

```
Genera comentarios JSDoc para documentación Swagger
de los endpoints de [recurso] en [controlador].js.
Incluye tags, params, responses, examples.
```

### Agregar Paginación

```
Agrega paginación a GET /api/v1/[recursos].
Query params: ?page=1&limit=20&sort=field&order=asc
Retorna: { data: [...], meta: { total, page, limit } }
```

### Agregar Filtrado

```
Agrega filtrado avanzado a GET /api/v1/[recursos].
Filtros: ?[campo1]=[valor]&[campo2]=[valor]&search=[término]
Implementa en servicio, valida en controlador.
```

### Validar Ownership

```
En [recurso]Service, agrega verificación de ownership.
Antes de editar/eliminar, verifica que userId === recurso.userId.
Si no coincide, lanza ForbiddenError.
```

---

## 🧪 Checklist Post-Generación

Cuando Copilot genere código:

```
[ ] ¿Es MVC? Controller, Service, Router separados
[ ] ¿Valida? express-validator antes del controlador
[ ] ¿Maneja errores? try/catch + clases personalizadas
[ ] ¿Responde bien? { data, meta } o { error }
[ ] ¿Tiene tests? ≥80% coverage, todos los casos
[ ] ¿Documentado? JSDoc + Swagger comments
[ ] ¿Pasa eslint? npm run lint sin errores
[ ] ¿Se registró? Router en src/routes/index.js
[ ] ¿Funciona? Tests pasan, npm run dev inicia
```

---

## 🔗 Enlaces Útiles

- **Instrucciones del Proyecto:** `.github/copilot-instructions.md`
- **Prompts Optimizados:** `.github/instructions/02-copilot-sdk-prompts.md`
- **Ejemplo Completo:** `.github/instructions/03-example-comments-crud.md`
- **GitHub Copilot Docs:** https://docs.github.com/en/copilot
- **Awesome Copilot Repo:** https://github.com/github/awesome-copilot

---

## 💡 Tips Prácticos

### Cuando el código generado se ve raro:

1. Verifica que el prompt incluya todas las restricciones
2. Agrega más contexto (campos específicos, validaciones exactas)
3. Pide que respete la estructura exacta (imports, nombres)

### Cuando hay errores de validación:

1. Copia el error exacto en un nuevo prompt
2. Pide que corrija específicamente ese error
3. Enfatiza que respete express-validator patterns

### Cuando los tests fallan:

1. Copia el error de test en un nuevo prompt
2. Pide que use fixtures correctas y beforeAll/afterAll
3. Asegúrate que el seed de datos es consistente

### Para mejorar la documentación:

1. Pide que genere JSDoc con ejemplos de request/response
2. Especifica que los ejemplos sean casos reales
3. Asegúrate que incluya todos los campos

---

## 📞 Si Algo Falla

1. **¿Qué pasó?** — Error específico, línea, archivo
2. **¿Qué esperabas?** — Comportamiento deseado
3. **¿Qué viste?** — Resultado actual
4. Copia el error exacto en un prompt de Copilot pidiendo que corrija

Ejemplo:

```
Mi test falla con este error:
[Error message]

¿Qué hay mal en [recurso]Router.test.js línea X?
```
