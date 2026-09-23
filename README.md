# MateCode

> **Línea principal nueva:** este branch `matecode` es el desarrollo activo (MateCode renovado y completo). La entrega M4 original quedó congelada en `main`.

Aplicación de gestión de tareas construida como proyecto integrador del Módulo 4 de Henry.

## Descripción

MateCode permite a los usuarios crear, editar, completar y eliminar tareas de forma persistente. Incluye autenticación con email y Google, sincronización en tiempo real vía Firestore, y envío de resúmenes por email a través de AWS SES.

Además de la consigna: tema claro y oscuro, validación con causa en formularios, ojo en contraseña, toasts de éxito y error, campo Nombre en registro, logo propio y filtros de tareas.

## URL de producción

[https://matecode-beige.vercel.app](https://matecode-beige.vercel.app)

Deploy actual de la entrega original. El redeploy del branch `matecode` va en el cierre, contra el repo nuevo.

## Arquitectura

MateCode/
├── api/
│   └── sendEmail.ts # Vercel Function - AWS SES (en Vercel las functions viven en api/, no en functions/)
├── src/
│   ├── components/ # Logo, ThemeToggle, Toast, PasswordInput, TodoForm, TodoList, TodoItem, ProtectedRoute
│   ├── features/
│   │   └── auth/ # Authenticator (provider + acciones) y authErrors (catálogo con causa)
│   ├── hooks/ # useAuth (contexto), useTasks (tiempo real), useTheme (claro/oscuro)
│   ├── pages/ # LoginPage, RegisterPage, TasksPage
│   ├── routes/ # AppRouter con rutas protegidas
│   ├── services/ # firebase, taskService (CRUD + onSnapshot), emailService (llama a /api/sendEmail)
│   ├── styles/ # theme.ts (clases Tailwind compartidas)
│   ├── types/ # Task y TaskFormValues
│   └── utils/ # validation (email, password, nombre, confirmación)
├── tests/ # Unit + componentes + mocks (38 tests)
├── firestore.rules # Espejo de las reglas activas en consola, como evidencia
├── .env.example # Plantilla sin secretos
├── vercel.json
├── vitest.config.ts
└── package.json

## Tecnologías

- **Frontend:** React 19, TypeScript, React Router v7, Tailwind v4
- **Backend:** Firebase Auth + Firestore
- **Email:** AWS SES vía Vercel Functions
- **Testing:** Vitest + React Testing Library + jest-dom
- **Deploy:** Vercel

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

**Frontend** (prefijo `VITE_`, van al bundle, la seguridad real son las rules):

| Variable                            | Descripción                |
| ----------------------------------- | -------------------------- |
| `VITE_FIREBASE_API_KEY`             | API Key de Firebase        |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Auth Domain de Firebase    |
| `VITE_FIREBASE_PROJECT_ID`          | Project ID de Firebase     |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Storage Bucket de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID        |
| `VITE_FIREBASE_APP_ID`              | App ID de Firebase         |

**Serverless** (sin prefijo, solo en Vercel Settings → Environment Variables, nunca en el frontend):

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
git checkout matecode
pnpm install
cp .env.example .env
pnpm dev
```

Scripts:

```bash
pnpm dev       # Desarrollo local
pnpm build     # Build de producción (tsc + vite)
pnpm test      # Ejecutar tests
pnpm lint      # Linting con oxlint
```

## Firestore Security Rules

Evidencia en `firestore.rules`, espejo de lo activo en consola. Denegación por defecto; en `tasks`:

- `get/list`: solo el propietario (`isOwnerExisting`)
- `create`: propietario entrante + forma válida (`isOwnerIncoming` + `hasValidShape`)
- `update`: propietario + `userId` inmutable + forma válida
- `delete`: solo el propietario

Índice compuesto activo: `tasks(userId ASC, createdAt DESC)`.

## Flujo de email

1. El usuario hace click en "Enviar resumen por email"
2. El frontend llama a `POST /api/sendEmail` (Vercel Function), nunca a AWS directo
3. La función valida el payload y usa AWS SES con credenciales serverless
4. La UI muestra toast de éxito o error; el botón refleja el envío en curso

Nota: la cuenta SES está en sandbox (solo envía a emails verificados), verificado con test real recibido.

## Testing

```bash
pnpm test
```

38 tests cubriendo:

- `errors` — catálogo completo de códigos Firebase (11 + genérico)
- `validation` — email, password, nombre y confirmación con causa
- `taskService` — exports y tipos
- `emailService` — delegación a la function propia y error-path (nunca AWS directo)
- `TodoForm` — renderizado del formulario
- `TodoItem` — renderizado, checkbox, eliminación
- `TodoList` — vacío, con tareas, botón email y filtros (con mocks de hooks)
- `PasswordInput` — ojo mostrar/ocultar y error visible
- `ThemeToggle` — alternancia y persistencia del tema
- `Toast` — mensaje disparado visible

Servicios externos mockeados: los tests no hacen llamadas reales.

## Decisiones de arquitectura

- **Auth con contexto único:** un solo `onAuthStateChanged` en el provider `Authenticator`. `useAuth` consume el contexto con la misma firma. Las acciones (`registerWithEmail`, `loginWithEmail`, `loginWithGoogle`, `logoutUser`) quedan como funciones puras.
- **Timestamp → Date:** `taskService` convierte los Timestamp de Firestore a Date nativos dentro del `onSnapshot`, los componentes trabajan con tipos nativos.
- **Service layer:** `firebase`, `taskService`, `emailService` como capas finas. Los componentes describen UI, no obtienen datos.
- **Nombre visible:** el registro guarda `displayName` con `updateProfile`; Google ya lo trae. El header muestra nombre con fallback a email.
- **Tema por clase `.dark`:** variante custom de Tailwind v4 con persistencia en `localStorage` y respeto a la preferencia del sistema.
- **`api/` y no `functions/`:** Vercel descubre las functions en `api/`. Se documenta para no confundir con la estructura sugerida.

## Uso de IA

Desarrollado con OpenCode (plan + build) y Claude en VSCode como apoyo, priorizando comprensión del código propio.

Patrones que más rindieron:

- **Pedir pasos antes que código:** planificar la edición archivo por archivo evitó reescrituras y redujo el diff.
- **Comparar con docs y clases:** cada pieza de las clases 8–11 se leyó, se adaptó a las convenciones del repo y solo se trajo lo necesario (contexto de auth, catálogo de errores, migración Firestore, form SES).
- **Tests para validar, no para cubrir:** cada incremento cerró con `tsc` en 0 y suite en verde antes de commitear; un test fallido frenó un commit y se corrigió con fix dedicado.
- **Verificar antes de afirmar:** índice Enabled, test SES recibido, `.env` jamás commiteado y 18→38 tests se comprobaron con comandos, no de memoria.

Lo que no delegué a la IA: credenciales y secretos (siempre manuales), decisiones de deploy y renombres en GitHub/Vercel (clicks propios), y el criterio final de qué entraba a cada commit.
