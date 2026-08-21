# MateCode

Aplicación de gestión de tareas construida como proyecto integrador del Módulo 4 de Henry.

## Descripción

MateCode permite a los usuarios crear, editar, completar y eliminar tareas de forma persistente. Incluye autenticación con email y Google, sincronización en tiempo real vía Firestore, y envío de resúmenes por email a través de AWS SES.

## URL de producción

[https://matecode-beige.vercel.app](https://matecode-beige.vercel.app)

## Estructura

```
MateCode/
├── api/
│   └── sendEmail.ts
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoItem.tsx
│   │   └── TodoList.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTasks.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TasksPage.tsx
│   ├── routes/
│   │   └── AppRouter.tsx
│   ├── services/
│   │   ├── auth.ts
│   │   ├── emailService.ts
│   │   ├── firebase.ts
│   │   └── taskService.ts
│   ├── styles/
│   │   └── pages.css
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── errors.ts
├── tests/
│   ├── setup.ts
│   ├── errors.test.ts
│   ├── taskService.test.ts
│   ├── TodoForm.test.tsx
│   ├── TodoItem.test.tsx
│   └── TodoList.test.tsx
├── .env.example
├── vercel.json
├── vitest.config.ts
└── package.json
```
## Tecnologías

- **Frontend:** React 19, TypeScript, React Router v7
- **Backend:** Firebase Auth + Firestore
- **Email:** AWS SES vía Vercel Functions
- **Testing:** Vitest + React Testing Library + jest-dom
- **Deploy:** Vercel

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

**Frontend** (prefijo `VITE_`):

| Variable                            | Descripción                |
| ----------------------------------- | -------------------------- |
| `VITE_FIREBASE_API_KEY`             | API Key de Firebase        |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Auth Domain de Firebase    |
| `VITE_FIREBASE_PROJECT_ID`          | Project ID de Firebase     |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Storage Bucket de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID        |
| `VITE_FIREBASE_APP_ID`              | App ID de Firebase         |

**Serverless** (sin prefijo, configurar en Vercel Settings → Environments):

| Variable                | Descripción                       |
| ----------------------- | --------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Access Key de IAM                 |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de IAM                 |
| `AWS_REGION`            | Región de AWS SES                 |
| `AWS_SES_SENDER`        | Email remitente verificado en SES |

## Instalación

```bash
git clone https://github.com/Ranz00/matecode.git
cd matecode
pnpm install
cp .env.example .env
pnpm dev
Scripts
pnpm dev       # Desarrollo local
pnpm build     # Build de producción
pnpm test      # Ejecutar tests
pnpm lint      # Linting con oxlint
Firestore Security Rules
Configuradas en Firebase Console con denegación por defecto para toda la base de datos. Para la colección tasks, se implementan funciones helper:

isSignedIn() — verifica autenticación del usuario
isOwnerExisting() / isOwnerIncoming() — verifica que el userId del token coincida con el del documento
hasValidShape() — valida la estructura de los campos (title, description, completed, userId con tipos correctos)
Permisos:

get/list: solo el propietario
create: solo el propietario + forma válida
update: solo el propietario + userId inmutable + forma válida
delete: solo el propietario
Las reglas se gestionan desde Firebase Console, no desde un archivo local.

Flujo de email
El usuario hace click en "Enviar resumen por email"
El frontend llama a POST /api/sendEmail (Vercel Function)
La función usa AWS SES con credenciales serverless para enviar el email con el resumen de tareas
Las credenciales de AWS están exclusivamente en el serverless, nunca en el frontend
Testing
pnpm test
18 tests cubriendo:

errors.ts — traducción de códigos Firebase
taskService.ts — verificación de exports y tipos
TodoForm — renderizado del formulario
TodoItem — renderizado, interacción del checkbox, eliminación
TodoList — estados vacío, con tareas, botón email (con mocks de hooks)
Decisiones de arquitectura
Auth sin Context: se usa onAuthStateChanged en useAuth que retorna { user, loading }. Cada componente que necesita auth consume el hook directamente, sin Provider global.
Timestamp → Date: taskService.ts convierte los Timestamp de Firestore a Date nativos dentro del listener onSnapshot, para que los componentes trabajen con tipos nativos.
Service layer: separación en auth.ts, taskService.ts, emailService.ts. Cada servicio es una capa fina con funciones puras.
Uso de IA
Desarrollado con la asistencia de OpenCode (modelo mimo-v2.5-free) para generación y refactorización de código, resolución de bugs, configuración de testing y deploy.


---
```
