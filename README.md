# MateCode

> **Ramas:** `matecode` (principal) + `matecode-legacy` (versión anterior).

Gestor de tareas full-stack — portfolio: React + TypeScript + Firebase Auth/Firestore + AWS SES vía serverless.

> **⚠️ Importante — email con AWS SES en sandbox:** cada resumen va a 2 direcciones (`AWS_SES_TO_EMAIL` fija + usuario logueado). Solo entrega entre identidades verificadas (SES → Verified identities); si una no lo está, rechaza todo. Gmail difiere ~1h y manda a spam (normal en remitente nuevo). La app avisa cada caso en el toast.
>
> **Nota — `vercel.json`:** la SPA tiene una sola página real; `rewrites` manda todo lo que no sea `/api/*` a `index.html` (sin esto, refresh en prod da 404). No toca código ni tests.
>
> **Credenciales:** el deploy corre con las del dueño (solo visibles en su Vercel). Tu copia usa 100% las tuyas (`.env` + tu Firebase/AWS). Nada se cruza.

## Descripción

Crear, editar, completar y eliminar tareas persistentes, con drag & drop, vencimientos y prioridades. Auth email + Google con nombre visible, tiempo real, tema claro/oscuro, validación con causa, toasts, filtros con conteo, logo propio y rebote de sesión.

## URL de producción

[https://matecode-epyon.vercel.app](https://matecode-epyon.vercel.app)

Deploy en Vercel desde `matecode` (también `matecode-beige.vercel.app`).

## Arquitectura

```
MateCode/
├── api/
│   └── sendEmail.ts        # Function: valida payload, exige env, envía al fijo + usuario
├── src/
│   ├── components/         # AuthHeader, Logo, LogoLink, PasswordInput, ProtectedRoute, ThemeToggle, Toast, TodoForm, TodoItem, TodoList
│   ├── features/
│   │   └── auth/           # Authenticator (provider + acciones), authErrors (con causa)
│   ├── hooks/              # useAuth, useTasks (tiempo real), useTheme
│   ├── pages/              # LoginPage, RegisterPage, TasksPage
│   ├── routes/             # AppRouter (protegidas + rebote)
│   ├── services/           # firebase, taskService (CRUD + batch de orden), emailService (/api/sendEmail)
│   ├── styles/             # theme.ts (clases Tailwind)
│   ├── types/              # Task (dueDate, priority, order), TaskPriority, TaskFormValues
│   └── utils/              # validation (con causa), order (merge testeable)
├── tests/                  # 12 archivos + setup (56 tests)
├── firestore.rules         # Espejo de consola, como evidencia
├── .env.example            # Plantilla sin secretos (11 vars)
├── vercel.json             # Rewrites SPA + timeout
├── vitest.config.ts
└── package.json            # pnpm; dev, build, test, lint, preview, dev:vercel
```

## Tecnologías

React 19 · TypeScript · React Router v7 · Tailwind v4 · dnd-kit · Firebase Auth/Firestore · AWS SES (Vercel Functions) · Vitest + RTL · Vercel

## Variables de entorno

Copiar `.env.example` a `.env` y completar (11 vars, sin valores en el repo):

**Frontend** (`VITE_*`, van al bundle): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

**Serverless** (solo Vercel → Environment Variables): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_SES_TO_EMAIL`, `AWS_SES_SENDER`.

## Instalación

```bash
git clone https://github.com/Ranz00/matecode.git
cd matecode
pnpm install
cp .env.example .env
pnpm dev
```

Scripts: `pnpm dev` (Vite) · `pnpm dev:vercel` (con function, requiere login) · `pnpm build` (`tsc` + vite) · `pnpm test` · `pnpm lint`.

## Firestore Security Rules

Evidencia en `firestore.rules`: denegar por defecto, solo propietario, `userId` inmutable. Índice `tasks(userId ASC, createdAt DESC)`; orden y filtros en cliente.

## Flujo de email

1. Click en "Enviar resumen" → `POST /api/sendEmail` (nunca AWS directo).
2. La function exige env + payload y envía a ambas direcciones; la UI muestra toast de éxito (con destinatario) o error específico.

## Testing

```bash
pnpm test
```

56 tests: errores Firebase, validaciones con causa, taskService + orden en batch, emailService (delegación + error-path + no-verificado), `mergeOrder`, TodoForm/Item/List (filtros, orden, toasts, rebote auth), PasswordInput, ThemeToggle, Toast. Mocks sin llamadas reales; `tsc` también tipa tests.

## Decisiones de arquitectura

- **Auth con contexto único** y acciones puras; rebote con sesión; logo según estado.
- **Timestamp → Date** con fallback, sin migración.
- **Completadas hunden;** arrastre intra-estado; `order` negativo en nuevos.
- **Drag contenido:** asa dedicada, sensor 8px, batch atómico, `mergeOrder` testeado.
- **Services finas;** `emailService` nunca AWS; errores con códigos blancos.
- **Nombre visible** (`displayName` con fallback); **dark** por clase + localStorage.
- **`api/` no `functions/`;** validación con causa que se limpia sola.

## Uso de IA

IA como auxiliar de velocidad, no de criterio: Antigravity (prototipado con el instructor), OpenCode (implementación guiada) y Claude (revisiones).

- Arquitectura por capas y decisiones técnicas propias: contexto único de auth, fail-fast con códigos blancos, orden manual con hundimiento, rewrites SPA.
- Bugs corregidos y cambios aplicados bajo criterio propio.
- Verificación con comandos antes de cada commit: `tsc` 0 + suite + e2e manual.
- Credenciales, deploys, renombres y criterio final de cada commit: manuales.
