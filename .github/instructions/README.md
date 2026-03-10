# 🚀 GitHub Copilot SDK — Guía de Uso

## 📌 ¿Qué es Copilot SDK?

**GitHub Copilot SDK** es un conjunto de herramientas que permite a GitHub Copilot entender y generar código siguiendo patrones específicos de tu proyecto.

En este proyecto, usamos Copilot SDK para:

- ✨ Generar CRUDs completos (Controller + Service + Router)
- 🧪 Crear tests automáticos
- 📚 Documentar endpoints con Swagger
- ✅ Validar inputs con express-validator
- 🛡️ Manejar errores consistentemente

**Resultado:** Menos código manual, más consistencia, más velocidad.

---

## ⚡ Quick Start (5 minutos)

### 1. Verificar que el SDK está instalado

```bash
copilot plugin list
```

Deberías ver:

```
✓ copilot-sdk (v1.0.0)
```

### 2. Abre GitHub Copilot Chat en VS Code

```
Cmd+L  (en macOS) o Ctrl+Shift+Alt+Enter (en Windows/Linux)
```

### 3. Copia un prompt

Abre `.github/instructions/00-quick-reference.md` y copia un prompt listo.

### 4. Pégalo en el Chat de Copilot

En el panel de chat que se abrió, pega el prompt y presiona Enter.

### 5. Revisa y copia el código generado

Copilot genera los archivos. Cópialos a sus ubicaciones correctas.

---

## 📂 Estructura de Documentación

La configuración de Copilot SDK se divide en estos archivos:

```
.github/instructions/
├── 00-quick-reference.md        ← Referencia rápida (EMPIEZA AQUÍ)
├── 01-copilot-sdk-setup.md      ← Explicación detallada del SDK
├── 02-copilot-sdk-prompts.md    ← Plantillas de prompts listos
├── 03-example-comments-crud.md  ← Ejemplo completo paso a paso
└── 04-vscode-integration.md     ← Cómo usar en VS Code
```

### 📖 Lee en Este Orden:

1. **Este archivo (README)** — contexto general
2. **`00-quick-reference.md`** — comandos y prompts rápidos
3. **`01-copilot-sdk-setup.md`** — configuración detallada
4. **`02-copilot-sdk-prompts.md`** — plantillas de prompts
5. **`03-example-comments-crud.md`** — ejemplo paso a paso
6. **`04-vscode-integration.md`** — integración con VS Code

---

## 🎯 Casos de Uso Típicos

### Caso 1: Crear un CRUD nuevo desde cero

**Tiempo:** ~10 minutos

1. Abre `.github/instructions/00-quick-reference.md`
2. Copia prompt "Generar CRUD"
3. Abre Copilot Chat en VS Code (Cmd+L)
4. Pega el prompt
5. Espera código generado
6. Copia archivos a sus ubicaciones
7. Ejecuta tests: `npm test`

**Resultado:** CRUD completo, validado, documentado, testeado

---

### Caso 2: Generar solo validaciones para un modelo

**Tiempo:** ~5 minutos

1. Abre `.github/instructions/00-quick-reference.md`
2. Copia prompt "Generar Solo Validaciones"
3. Pega en Copilot Chat
4. Copia el código de validación generado
5. Intégralo en tu router

---

### Caso 3: Generar tests para código existente

**Tiempo:** ~10 minutos

1. Abre `.github/instructions/00-quick-reference.md`
2. Copia prompt "Generar Tests"
3. Abre el archivo que quieres probar
4. En Copilot Chat referencia el archivo: `@miarchivo.js`
5. Pega el prompt
6. Copia los tests generados
7. Ejecuta: `npm test`

---

## ✅ Verificación: ¿Está Todo Instalado?

```bash
# 1. ¿Está GitHub Copilot CLI instalado?
which copilot
# Deberías ver: /opt/homebrew/bin/copilot (en macOS)

# 2. ¿Está el SDK plugin instalado?
copilot plugin list | grep copilot-sdk
# Deberías ver: copilot-sdk (v1.0.0)

# 3. ¿Está GitHub Copilot en VS Code?
# Abre VS Code
# Deberías ver el logo de Copilot en la barra lateral

# 4. ¿Puedo abrir el chat de Copilot?
# Cmd+L debería abrir el panel de chat
```

Si todo funciona, ¡estás listo! 🎉

---

## 🎨 Patrón MVC que Copilot Respeta

El SDK genera código siguiendo **MVC en 3 capas**:

```javascript
// 1. CONTROLLER — Gestiona HTTP
// src/controllers/userController.js
export async function getUser(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

// 2. SERVICE — Lógica de negocio
// src/services/userService.js
export async function getById(id) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  return user;
}

// 3. ROUTER — Encadena middlewares
// src/routes/userRouter.js
router.get('/:id', getUser);
```

---

## 📋 Prompts Listos para Copiar

### 🔧 Crear un CRUD Completo

```
Genera un CRUD completo para [NOMBRE_RECURSO] en Express.js.

ESTRUCTURA MVC:
- Controller: src/controllers/[recurso]Controller.js
- Service: src/services/[recurso]Service.js
- Routes: src/routes/[recurso]Router.js
- Tests: tests/routes/[recurso]Router.test.js

ENDPOINTS:
GET    /api/v1/[recursos]
GET    /api/v1/[recursos]/:id
POST   /api/v1/[recursos]
PATCH  /api/v1/[recursos]/:id
DELETE /api/v1/[recursos]/:id

VALIDACIÓN: express-validator, trim + escape, mensajes en español
AUTH: Bearer JWT
ERRORES: Clases de src/errors/
RESPUESTAS: { data, meta } éxito, { error } error
TESTS: Jest + Supertest, ≥80% coverage
```

---

### ✏️ Validaciones Solo

```
Genera validaciones express-validator para [RECURSO]:

Campos:
- [campo1]: [tipo], [restricciones]
- [campo2]: [tipo], [restricciones]

Usa .trim().escape(), mensajes en español.
Exporta como array para middleware.
```

---

### 🧪 Tests Solo

```
Genera tests Jest + Supertest para [RUTA].

Casos: 200, 201, 400, 401, 404, 409, 422, 500
Usa fixtures, beforeAll, afterAll.
Cobertura ≥80%.
```

---

## 🔗 Ejemplos en el Proyecto

Puedes ver ejemplos de código generado (o que sigue este patrón) en:

- **Controller:** `src/controllers/usersController.js`
- **Service:** `src/services/usersService.js`
- **Router:** `src/routes/usersRouter.js`
- **Tests:** `tests/routes/usersRouter.test.js`
- **Errores:** `src/errors/NotFoundError.js`
- **Validación:** `src/middlewares/validate.js`

Abre estos archivos si quieres ver patrones que Copilot SDK sigue.

---

## 🚀 Próximos Pasos

### Ahora mismo:

1. ✅ Lee `.github/instructions/00-quick-reference.md`
2. ✅ Verifica instalación (ver sección "Verificación" arriba)
3. ✅ Abre Copilot Chat (Cmd+L)

### En 10 minutos:

1. 📝 Copia prompt de "Generar CRUD" de quick-reference.md
2. 🤖 Pega en Copilot Chat
3. ⏳ Espera respuesta
4. 📋 Copia archivos generados

### En 30 minutos:

1. 🔗 Registra el router en `src/routes/index.js`
2. 🧪 Ejecuta tests: `npm test`
3. 🔍 Ejecuta linter: `npm run lint`
4. ✨ Servidor debería funcionar: `npm run dev`

---

## 📚 Documentación Completa

Para información más detallada, lee:

| Archivo                       | Contenido                           |
| ----------------------------- | ----------------------------------- |
| `01-copilot-sdk-setup.md`     | Explicación del SDK, objetivos, uso |
| `02-copilot-sdk-prompts.md`   | Plantillas de prompts listos        |
| `03-example-comments-crud.md` | Ejemplo paso a paso de un CRUD      |
| `04-vscode-integration.md`    | Cómo integrar con VS Code           |

---

## 🆘 ¿Algo Falla?

### El SDK no está instalado

```bash
copilot plugin install awesome-copilot:plugins/copilot-sdk
```

### No puedo abrir Copilot Chat

- Asegúrate de tener GitHub Copilot extensión en VS Code
- Actualiza VS Code a la última versión
- Reinicia VS Code

### El código generado no compila

1. Copia el error exacto
2. En Copilot Chat, pregunta: "¿Por qué da este error?"
3. Copilot te ayuda a corregir

### Los tests fallan

1. Ejecuta: `npm test -- --verbose`
2. Copia el error
3. Pregunta en Copilot Chat

---

## 💡 Tips Prácticos

### 🎯 Prompts Mejores = Código Mejor

- Sé específico sobre campos, validaciones, restricciones
- Menciona relaciones con otros modelos
- Describe el comportamiento esperado exactamente

### 🔄 Iteración

Si el código no es perfecto:

1. Copia el error o lo que está mal
2. Pide que corrija específicamente eso
3. Copilot aprende del contexto

### 📖 Referencia el Proyecto

En Copilot Chat, puedes usar:

- `@archivo.js` — referencia un archivo específico
- `@workspace` — pregunta sobre el proyecto en general

### 🧪 Siempre Ejecuta Tests

```bash
npm test
npm run lint
npm run dev  # Verifica que inicia
```

---

## 🎉 ¡Listo para Empezar!

Ahora que todo está instalado y configurado:

1. 📖 Lee `00-quick-reference.md`
2. 🤖 Abre Copilot Chat (Cmd+L en VS Code)
3. 📋 Copia un prompt de quick-reference.md
4. ✨ Pega en el chat y observa la magia

**Tiempo para tu primer CRUD:** ~15 minutos

---

## 📞 Más Ayuda

- **GitHub Copilot Docs:** https://docs.github.com/en/copilot
- **Awesome Copilot Repo:** https://github.com/github/awesome-copilot
- **Este Proyecto:** `.github/instructions/`

---

**Última actualización:** Marzo 10, 2026  
**Versión de Copilot SDK:** 1.0.0  
**Versión de Node.js Recomendada:** 18+
