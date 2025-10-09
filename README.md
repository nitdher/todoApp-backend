# TodoApp Backend

Backend API para TodoApp desarrollado con Express, TypeScript y Firebase Firestore.

## Tecnologías

- **Node.js** + **Express**
- **TypeScript**
- **Firebase Firestore**
- **Firebase Functions**
- **express-validator**

## Arquitectura

Clean Architecture con Domain-Driven Design (DDD) aplicando principios SOLID:

```
src/
├── domain/                    # Entidades y contratos
│   ├── entities/             # User, Task
│   └── repositories/         # Interfaces
├── application/              # Casos de uso
│   └── useCases/
│       ├── users/
│       └── tasks/
├── infrastructure/           # Implementaciones
│   ├── firestore/           # Repositorios Firestore
│   ├── middleware/          # Validadores y error handlers
│   └── errors/              # Custom errors
└── interfaces/              # HTTP layer
    ├── controllers/
    └── routes/
```

## API Endpoints

### Users

**Verificar si usuario existe**
```bash
POST /api/users/check
Content-Type: application/json

{
  "email": "user@example.com"
}

# Respuesta 200:
{
  "success": true,
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "createdAt": "2025-10-07T10:00:00Z"
  }
}

# Respuesta 404:
{
  "success": false,
  "error": "User not found"
}
```

**Crear usuario**
```bash
POST /api/users
Content-Type: application/json

{
  "email": "newuser@example.com"
}

# Respuesta 201:
{
  "success": true,
  "data": {
    "id": "xyz789",
    "email": "newuser@example.com",
    "createdAt": "2025-10-07T10:05:00Z"
  }
}
```

### Tasks

**Obtener tareas por usuario**
```bash
GET /api/tasks/user/:userId

# Respuesta 200:
{
  "success": true,
  "data": [
    {
      "id": "task1",
      "userId": "abc123",
      "title": "Mi tarea",
      "description": "Descripción de la tarea",
      "completed": false,
      "createdAt": "2025-10-07T10:10:00Z",
      "updatedAt": "2025-10-07T10:10:00Z"
    }
  ]
}
```

**Crear tarea**
```bash
POST /api/tasks
Content-Type: application/json

{
  "userId": "abc123",
  "title": "Nueva tarea",
  "description": "Descripción de mi nueva tarea",
  "completed": false
}

# Respuesta 201:
{
  "success": true,
  "data": {
    "id": "task2",
    "userId": "abc123",
    "title": "Nueva tarea",
    "description": "Descripción de mi nueva tarea",
    "completed": false,
    "createdAt": "2025-10-07T10:15:00Z",
    "updatedAt": "2025-10-07T10:15:00Z"
  }
}
```

**Actualizar tarea**
```bash
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "completed": true
}

# Respuesta 200:
{
  "success": true,
  "data": {
    "id": "task2",
    "userId": "abc123",
    "title": "Tarea actualizada",
    "description": "Descripción de mi nueva tarea",
    "completed": true,
    "createdAt": "2025-10-07T10:15:00Z",
    "updatedAt": "2025-10-07T10:20:00Z"
  }
}
```

**Eliminar tarea**
```bash
DELETE /api/tasks/:id

# Respuesta 200:
{
  "success": true,
  "data": null
}
```

### Health

**Health check**
```bash
GET /health

# Respuesta 200:
{
  "status": "ok",
  "timestamp": "2025-10-07T10:00:00.000Z"
}
```

## Validaciones

Validación en dos niveles:

1. **Middlewares** (express-validator): tipos, formatos, rangos
2. **Entidades de dominio**: reglas de negocio

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
SERVER_PORT=3000
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

> **Nota sobre Firebase**: La autenticación con Firebase se realiza mediante el archivo `serviceAccountKey.json` en la raíz del proyecto. Este archivo se obtiene de Firebase Console > Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada.

## Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Descargar serviceAccountKey.json de Firebase Console y colocarlo en la raíz del proyecto
```

## Desarrollo

```bash
pnpm dev          # Desarrollo con hot reload en http://localhost:3000
pnpm build        # Build para producción
pnpm start        # Ejecutar build de producción
pnpm lint         # Ejecutar linter
pnpm lint:fix     # Fix automático de problemas de linting
pnpm test         # Ejecutar tests unitarios
```

## Deploy a Firebase Functions

```bash
# Login a Firebase (solo la primera vez)
firebase login

# Seleccionar proyecto
firebase use <tu-proyecto-id>

# Deployar funciones
pnpm deploy
```

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  createdAt: Date;
}
```

### Task
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

Todas las respuestas de error siguen el formato:

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

**Códigos de estado HTTP:**
- `400 Bad Request` - Validación fallida
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con el estado actual
- `500 Internal Server Error` - Error del servidor

## 👨‍💻 Autor

**Nitdher González**

Desarrollado como parte del challenge técnico FullStack Developer de ATOM.
