# Cliente React — Aplicación que consume la API

## Variables de entorno

Crea un archivo `.env` en la carpeta `client/`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Arranque rápido (Vite + React + TypeScript)

```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

## Estructura

```
client/src/
├── types/
│   ├── api.ts          # Interfaces genéricas (ApiResponse, PaginatedResponse)
│   ├── auth.ts         # LoginPayload, RegisterPayload, AuthTokens
│   ├── user.ts         # User, UpdateUserPayload, UserQueryParams
│   └── post.ts         # Post, CreatePostPayload, UpdatePostPayload
│
├── services/
│   ├── api.ts          # Cliente fetch base con refresco de token automático
│   ├── authService.ts  # register, login, refresh, logout
│   ├── usersService.ts # getAll, getById, update, remove
│   └── postsService.ts # getAll, getById, create, update, remove
│
├── hooks/
│   ├── useAuth.ts      # login, register, logout + estado
│   ├── usePosts.ts     # CRUD completo + estado paginado
│   └── useUsers.ts     # CRUD parcial + estado paginado
│
├── utils/
│   ├── storage.ts      # Gestión de tokens en localStorage
│   ├── formatters.ts   # formatDate, formatRelativeTime, truncate
│   └── validators.ts   # Validaciones de campos
│
└── components/
    ├── ui/
    │   └── Button.tsx
    ├── auth/
    │   └── LoginForm.tsx
    ├── posts/
    │   ├── PostCard.tsx
    │   ├── PostForm.tsx
    │   └── PostList.tsx
    └── users/
        └── UserCard.tsx
```

## Endpoints de la API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registro |
| POST | `/auth/login` | No | Login → tokens |
| POST | `/auth/refresh` | No | Refresh token |
| POST | `/auth/logout` | JWT | Logout |
| GET | `/users` | JWT | Listar usuarios |
| GET | `/users/:id` | JWT | Obtener usuario |
| PATCH | `/users/:id` | JWT | Actualizar usuario |
| DELETE | `/users/:id` | JWT | Eliminar usuario |
| GET | `/posts` | No | Listar posts (público) |
| GET | `/posts/:id` | No | Obtener post (público) |
| POST | `/posts` | JWT | Crear post |
| PUT | `/posts/:id` | JWT | Actualizar post (autor) |
| DELETE | `/posts/:id` | JWT | Eliminar post (autor) |
