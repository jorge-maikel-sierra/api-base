# GitHub Copilot SDK — Configuración del Proyecto

## 📌 Descripción General

El **GitHub Copilot SDK** permite construir aplicaciones con GitHub Copilot integrando capacidades de IA en tu flujo de desarrollo. Para este proyecto REST API Node.js, usaremos el SDK para:

- Generar código siguiendo el patrón MVC de 3 capas
- Crear endpoints REST siguiendo las convenciones del proyecto
- Implementar validación y manejo de errores estandarizado
- Generar tests automáticos

## 🎯 Objetivos del SDK en este Proyecto

1. **Generación de Código Estándar** — Controllers, Services, Routes
2. **Validación Automática** — express-validator con patrones consistentes
3. **Manejo de Errores** — Clases de error personalizadas
4. **Documentación OpenAPI** — Swagger JSDoc automático
5. **Testing** — Jest + Supertest con cobertura mínima 80%

## 🚀 Instalación y Activación

El plugin ya está instalado. Verifica:

```bash
copilot plugin list
```

Deberías ver:

```
✓ copilot-sdk (v1.0.0)
```

## 📋 Estructura de Uso

### 1. **Generar un Nuevo Endpoint (Controller + Service + Route)**

Cuando necesites crear un nuevo endpoint, proporciona a Copilot:

```
Crea un nuevo endpoint para [recurso] con las siguientes operaciones:
- GET /api/v1/[recursos] — listar (con paginación)
- GET /api/v1/[recursos]/:id — obtener uno
- POST /api/v1/[recursos] — crear
- PUT /api/v1/[recursos]/:id — actualizar completo
- PATCH /api/v1/[recursos]/:id — actualizar parcial
- DELETE /api/v1/[recursos]/:id — eliminar

Sigue el patrón MVC de 3 capas:
- Crear src/controllers/[recurso]Controller.js
- Crear src/services/[recurso]Service.js
- Crear src/routes/[recurso]Router.js
- Registrar en src/routes/index.js

Usa validación con express-validator.
```

### 2. **Generar Tests**

Para cada controlador/servicio:

```
Genera tests de Jest para [recurso]Service.js y [recurso]Controller.js.

Casos de prueba mínimos:
- Caso exitoso (200/201)
- Input inválido (422)
- No autorizado (401)
- Recurso no encontrado (404)
- Conflicto (409) si aplica

Usa Supertest para tests de integración de rutas.
```

### 3. **Generar Documentación OpenAPI**

Para documentar un endpoint nuevo:

```
Genera comentarios JSDoc con swagger-jsdoc para el endpoint
[ruta] en [archivo-controller].js.

Incluye:
- Descripción clara
- Parámetros (path, query, body)
- Respuestas exitosas y de error
- Códigos HTTP (200, 201, 400, 401, 403, 404, 409, 422, 500)
```

## 🔧 Prompts Recomendados para el SDK

### Generar un CRUD Completo

```
Genera un CRUD completo para el recurso "[recurso]" siguiendo estas reglas:

Patrón MVC estricto:
- Controller: solo maneja req/res, llama al servicio
- Service: contiene lógica de negocio
- Data Access: interactúa con Prisma

Endpoints REST:
- GET /api/v1/[recursos] (paginación: ?page=1&limit=20)
- GET /api/v1/[recursos]/:id
- POST /api/v1/[recursos]
- PUT /api/v1/[recursos]/:id
- PATCH /api/v1/[recursos]/:id
- DELETE /api/v1/[recursos]/:id

Validación:
- Usa express-validator
- Todas las validaciones ANTES del controlador
- Responde 422 si hay errores

Manejo de Errores:
- Importa clases de src/errors/
- Usa try/catch en servicios
- Responde con { error: { message, code } }

Tests:
- Jest + Supertest
- Mínimo casos exitoso, inválido (422), no autorizado (401), no encontrado (404)
- Cobertura ≥ 80%

Documentación:
- JSDoc con swagger-jsdoc en controllers
- Comentarios /** */ para cada endpoint
```

### Generar Solo Validación

```
Genera validaciones con express-validator para [recurso]:

Campos:
- [campo1]: [tipo, reglas de validación]
- [campo2]: [tipo, reglas de validación]

Incluye:
- .trim().escape() para prevenir XSS
- Mensajes de error en español
- Normalización de emails si aplica
- Validación de longitud, formato, etc.

Exporta un array de validaciones listo para middleware.
```

### Generar Tests de Integración

```
Genera tests de integración con Supertest para la ruta
GET /api/v1/[recursos]/:id

Casos:
- 200 OK con datos válidos
- 404 si el recurso no existe
- 401 si no está autorizado
- Validación de estructura de respuesta

Usa beforeAll/afterAll para setup de base de datos.
```

## 📐 Plantilla de Respuesta Estándar

El SDK debe generar respuestas en este formato:

**Éxito (200, 201):**

```js
res.status(200).json({
  data: resultado,
  meta: { total, page, limit },
});
```

**Error (4xx, 5xx):**

```js
res.status(400).json({
  error: {
    message: 'Descripción clara del error',
    code: 'ERROR_CODE',
  },
});
```

## 🛡️ Reglas No Negociables

1. **Nunca mezclar capas** — Controller, Service, Data Access separados
2. **Siempre validar input** — antes del controlador
3. **Siempre usar clases de error personalizadas** — de src/errors/
4. **Nunca hardcodear secrets** — leer de process.env
5. **Nunca exponer stack traces** — en producción
6. **Siempre escribir tests** — mínimo 80% cobertura
7. **ESLint + Prettier (Airbnb)** — no modificar configuración

## 🔗 Integración con el Proyecto

Los siguientes archivos están disponibles para el SDK:

- `.github/copilot-instructions.md` — instrucciones principales del proyecto
- `src/config/database.js` — configuración Prisma
- `src/errors/` — clases de error personalizadas
- `src/middlewares/validate.js` — validación con express-validator
- `src/middlewares/errorHandler.js` — manejo global de errores
- `src/routes/index.js` — registro de rutas

Asegúrate de que el SDK respete estas estructuras.

## ✅ Checklist de Uso

Cuando uses el SDK para generar código:

- [ ] Verifiqué que el código siga el patrón MVC
- [ ] Validé todas las entradas con express-validator
- [ ] Importé las clases de error desde src/errors/
- [ ] Escribí tests con ≥80% cobertura
- [ ] Generé documentación JSDoc + Swagger
- [ ] El código pasa eslint sin errores
- [ ] Verificué que responda con formato estándar
- [ ] Registré las rutas en src/routes/index.js
