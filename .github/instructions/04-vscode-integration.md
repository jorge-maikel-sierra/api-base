# Configuración de Copilot SDK en VS Code

## 🔧 Instalación de GitHub Copilot en VS Code

### Paso 1: Instalar Extensión

1. Abre VS Code
2. Ve a Extensions (Cmd+Shift+X)
3. Busca "GitHub Copilot"
4. Haz clic en "Install"
5. Reinicia VS Code

### Paso 2: Autenticación

1. Presiona Cmd+Shift+P
2. Escribe "GitHub Copilot: Sign In"
3. Sigue el flujo de autenticación
4. Autoriza GitHub Copilot

### Paso 3: Verificar Instalación

En la terminal:

```bash
copilot --version
# Deberías ver: GitHub Copilot CLI 0.0.xxx
```

---

## 🎯 Copilot Chat en VS Code

### Abrir Chat

- **Atajo:** Cmd+I (inline chat en línea)
- **Atajo:** Cmd+L (chat en panel lateral)
- **Menú:** View → Copilot Chat

### Usar SDK en Chat

El SDK está disponible automáticamente en Copilot Chat. Puedes:

1. **Seleccionar código** → Cmd+I → Pedir modificaciones
2. **Abrir panel Chat** → Cmd+L → Hacer preguntas contextuales
3. **Referenciar archivos:** En chat escribe `#file` + nombre

---

## 📝 Cómo Usar Copilot SDK en VS Code

### Opción 1: Chat Inline (Más Rápido)

1. Abre un archivo .js
2. Presiona **Cmd+I**
3. Escribe tu prompt:
   ```
   Genera un servicio para manejar [recurso].
   Usa Prisma, try/catch, y lanza errores de src/errors/.
   ```
4. Presiona Enter
5. Copilot genera el código

### Opción 2: Chat en Panel (Más Control)

1. Presiona **Cmd+L**
2. En el panel de la derecha, escribe:
   ```
   Quiero generar un CRUD para comentarios.
   Los comentarios están bajo posts: /api/v1/posts/:postId/comments
   ```
3. Presiona Enter
4. Copilot da opciones o pregunta detalles
5. Copilot genera el código

### Opción 3: Referenciar Instrucciones del Proyecto

En el chat, usa `@` para referenciar:

```
@workspace ¿Cuál es el patrón MVC de este proyecto?
```

O referenciar un archivo:

```
@authController.js Genera un servicio similar para [recurso]
```

---

## ✅ Configuración .vscode

Para optimizar la experiencia, crea `.vscode/settings.json` si no existe:

```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true
  },
  "github.copilot.chat.localeOverride": "es",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "editor.guides.bracketPairs": true,
  "editor.minimap.enabled": false
}
```

Y `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Prisma.prisma"
  ]
}
```

---

## 🎮 Workflow Típico con SDK

### 1️⃣ Crear un Nuevo Endpoint

```bash
# Terminal
npm run dev
```

En VS Code:

```
Cmd+L → Abre Chat
Panel Chat escribe:
"""
Necesito crear un CRUD para comentarios anidados bajo posts.
La ruta es /api/v1/posts/:postId/comments

Campos del comentario:
- content (string, 1-5000 chars)
- userId (relacionado con User)
- postId (relacionado con Post)

Solo el autor del comentario puede editarlo/borrarlo.

Usa el patrón MVC de este proyecto:
- Controller: src/controllers/commentsController.js
- Service: src/services/commentsService.js
- Router: src/routes/commentsRouter.js
- Tests: tests/routes/commentsRouter.test.js

Incluye validación con express-validator y tests.
"""

Presiona Enter y espera la respuesta
```

### 2️⃣ Revisar y Copiar el Código

Copilot mostrará:

- Estructura de archivos a crear
- Código generado
- Explicación del código

Copia cada sección y:

1. Crea el archivo
2. Pega el código
3. Guarda

### 3️⃣ Integrar al Proyecto

```bash
# Actualizar Schema Prisma (si es necesario)
npm run prisma:migrate

# Registrar Router en src/routes/index.js
# (Añade: import commentsRouter from './commentsRouter.js')

# Ejecutar tests
npm test tests/routes/commentsRouter.test.js

# Verificar linter
npm run lint
```

### 4️⃣ Validar

```bash
# El servidor ya está corriendo con npm run dev
# En otra terminal:

# Crear comentario
curl -X POST http://localhost:3000/api/v1/posts/1/comments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Mi comentario"}'

# Listar
curl http://localhost:3000/api/v1/posts/1/comments
```

---

## 🐛 Debugging con Copilot

Si hay un error:

1. **Copiar el error exacto**
2. **Cmd+I en el archivo problemático**
3. **Escribir:**

   ```
   Este código da error:
   [pegar error exacto]

   ¿Qué está mal?
   ```

4. **Copilot explica y sugiere fix**

---

## 📚 Recursos en el Chat

### Referenciar Proyecto

```
@workspace ¿Cuáles son las reglas de validación del proyecto?
```

### Referenciar Archivo

```
@authService.js ¿Puedo hacer algo similar para comentarios?
```

### Preguntar sobre Estructura

```
@workspace Genera un CRUD para [recurso] siguiendo tu estructura
```

---

## 🚀 Atajos Útiles VS Code

| Acción                          | Atajo       |
| ------------------------------- | ----------- |
| **Copilot Chat Inline**         | Cmd+I       |
| **Copilot Chat Panel**          | Cmd+L       |
| **Copilot Accept**              | Tab         |
| **Copilot Dismiss**             | Esc         |
| **Copilot Cycle Suggestions**   | Alt+]       |
| **Copilot Previous Suggestion** | Alt+[       |
| **Command Palette**             | Cmd+Shift+P |
| **Quick Fix**                   | Cmd+.       |

---

## ⚠️ Limitaciones y Consideraciones

1. **Copilot genera sugerencias** — siempre revisa el código
2. **Puede no seguir todo exactamente** — ajusta si es necesario
3. **Mejor con prompts detallados** — más contexto = mejor código
4. **Usa referencias a archivos** — `@filename` en chat
5. **Verifica tests** — Copilot puede generar tests pero revísalos

---

## ✨ Ejemplo Completo: Desde Chat hasta Función

### Paso 1: Chat Inline

```javascript
// En authService.js, coloca el cursor al final
// Presiona Cmd+I

Agrega función "verifyTokenExpiration" que:
- Recibe un token
- Verifica si está expirado
- Lanza UnauthorizedError si está expirado
- Devuelve el payload decodificado

Usa jsonwebtoken y process.env.JWT_SECRET
```

### Paso 2: Revisar

Copilot sugiere el código. Revísalo.

### Paso 3: Aceptar

Presiona Tab para aceptar.

### Paso 4: Guardar

Cmd+S guarda el archivo.

### Paso 5: Probar

```bash
npm run lint  # Verificar formato
npm test      # Ejecutar tests
```

---

## 🎯 Next Steps

1. ✅ **GitHub Copilot instalado** en VS Code
2. ✅ **Copilot SDK instalado** (CLI)
3. ✅ **Instrucciones del proyecto** en `.github/`
4. ✅ **Prompts listos** en `.github/instructions/`

**Ahora ya puedes:**

- Usar `Cmd+L` para abrir chat
- Copiar prompts de `.github/instructions/02-copilot-sdk-prompts.md`
- Generar CRUDs automáticamente
- Crear tests y documentación

¡Comienza con el ejemplo de comentarios en `.github/instructions/03-example-comments-crud.md`!
