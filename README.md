# MateCode

> **Ramas:** `matecode` (principal, app actual) + `matecode-legacy` (versión anterior conservada).

Gestor de tareas full-stack — proyecto de portfolio: React + TypeScript + Firebase Auth/Firestore + AWS SES vía serverless.

> **⚠️ Importante — cómo funciona el email (AWS SES en sandbox)**
>
> **Proceso:** el botón arma el resumen con el estado vivo de tus tareas → `POST /api/sendEmail` → la Vercel Function valida el payload y llama a SES con credenciales solo-serverless → toast de éxito/error.
>
> **Destinatarios:** el email fijo de `AWS_SES_TO_EMAIL` y el email del usuario logueado. Motivo: el dueño recibe copia de cada resumen generado.
>
> **Pero sandbox:** sin dominio propio no hay production access. En sandbox SES **solo entrega entre identidades verificadas** (AWS Console → SES → Verified identities); si una no lo está, SES rechaza el envío **completo**.
>
> **Demora y spam (normal):** remitente nuevo sin SPF/DKIM → Gmail difiere hasta ~1h y clasifica como spam. Verificado con entregas reales.
>
> **Para desarrollo local:** completar las 11 vars del `.env.example` y verificar ambas direcciones en SES. Ante error, mirar el toast + Network (`POST /api/sendEmail`).
>
> Si tu dirección no está verificada, la propia app te lo dice en el toast de error — no hace falta adivinar qué pasó.

> **Nota — `vercel.json` (configuración de deploy, no código)**
>
> **Por qué existe:** la SPA tiene una sola página real (`index.html`); el router finge las demás. `rewrites` declara que toda ruta que no sea `/api/*` sirva `index.html` para que el router decida. `functions/maxDuration` fija el timeout de la function en 10s.
>
> **Motivo probado:** sin `rewrites`, recargar o abrir directo `/tasks` en producción da 404 (en local no pasa porque Vite redirige solo). Verificado el 404 real y su corrección en prod.
>
> **Qué NO afecta:** ningún `.ts`/test, variables, Firebase ni el bundle. Quitarlo no rompe el build ni los tests — rompe refresh y links directos en prod, en silencio.
>
> **Cómo verificarlo:** deploy → abrir `/tasks` → F5 → debe cargar. Si da 404, falta este archivo.

## Descripción

MateCode permite crear, editar, completar y eliminar tareas de forma persistente, con drag & drop manual, vencimientos y prioridades. Incluye autenticación con email y Google (con nombre visible), sincronización en tiempo real vía Firestore, y resúmenes por email vía AWS SES.

Además: tema claro y oscuro persistente, validación con causa en formularios, ojo en contraseñas, toasts de éxito y error, logo propio bicolor, filtros con conteo, headers sticky y rebote de sesión.

## URL de producción

[https://matecode-epyon.vercel.app](https://matecode-epyon.vercel.app)

Deploy en Vercel desde `matecode` (también responde en `matecode-beige.vercel.app`).

## Arquitectura

```
MateCode/
├── api/
│   └── sendEmail.ts        # Vercel Function: valida payload, exige env, envía al fijo + usuario (en Vercel las functions viven en api/, no en functions/)
├── src/
│   ├── components/         # AuthHeader, Logo, LogoLink, PasswordInput, ProtectedRoute, ThemeToggle, Toast, TodoForm, TodoItem, TodoList
│   ├── features/
│   │   └── auth/           # Authenticator (provider + acciones) y authErrors (catálogo con causa)
│   ├── hooks/              # useAuth (contexto), useTasks (tiempo real), useTheme (claro/oscuro)
│   ├── pages/              # LoginPage, RegisterPage, TasksPage
│   ├── routes/             # AppRouter con protegidas y rebote con sesión
│   ├── services/           # firebase, taskService (CRUD + onSnapshot + batch de orden), emailService (llama a /api/sendEmail)
│   ├── styles/             # theme.ts (clases Tailwind compartidas)
│   ├── types/              # Task (con dueDate, priority, order), TaskPriority, TaskFormValues
│   └── utils/              # validation (con causa) y order (merge de arrastre testeable)
├── tests/                  # AuthRedirect, emailService, errors, order, PasswordInput, ThemeToggle, Toast, TodoForm, TodoItem, TodoList, taskService, validation + setup (56 tests)
├── firestore.rules         # Espejo de las reglas activas en consola, como evidencia
├── .env.example            # Plantilla sin secretos (11 vars)
├── vercel.json             # Rewrites SPA + timeout de function
├── vitest.config.ts
└── package.json            # pnpm; dev, build, test, lint, preview y dev:vercel
```

## Tecnologías

- **Frontend:** React 19, TypeScript, React Router v7, Tailwind v4, dnd-kit (arrastre)
- **Backend:** Firebase Auth + Firestore
- **Email:** AWS SES vía Vercel Functions
- **Testing:** Vitest + React Testing Library + jest-dom
- **Deploy:** Vercel

## Variables de entorno

Copiar `.env.example` a `.env` y completar (11 vars, sin valores reales en el repo):

**Frontend** (prefijo `VITE_`, van al bundle; la seguridad real son las rules): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

**Serverless** (sin prefijo, solo en Vercel Settings → Environment Variables, nunca en el frontend): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_SES_TO_EMAIL`, `AWS_SES_SENDER`.

## Instalación

```bash
git clone https://github.com/Ranz00/matecode.git
cd matecode
pnpm install
cp .env.example .env
pnpm dev
```

Scripts: `pnpm dev` (Vite) · `pnpm dev:vercel` (frontend + function en local, requiere `vercel login` y link) · `pnpm build` (`tsc` + vite, incluye tests en el tipado) · `pnpm test` · `pnpm lint`.

## Firestore Security Rules

Evidencia en `firestore.rules`, espejo de lo activo en consola. Denegación por defecto; en `tasks`: lectura y borrado solo propietario, creación con forma válida, edición con `userId` inmutable y forma válida (`title`, `description`, `completed`, `userId`, `priority`, `dueDate` y `order` opcionales).

Índice compuesto activo: `tasks(userId ASC, createdAt DESC)`. El orden manual y los filtros se resuelven en cliente, sin índices extra.

## Flujo de email

1. El usuario hace click en "Enviar resumen por email".
2. El frontend llama a `POST /api/sendEmail` (Vercel Function), nunca a AWS directo.
3. La función exige `AWS_SES_TO_EMAIL` + `AWS_SES_SENDER` (400 si faltan), valida el payload y envía a ambas direcciones con credenciales serverless.
4. La UI muestra toast de éxito (con destinatario) o error específico (dirección no verificada con puntero al README, u otro); el botón refleja el envío en curso.

## Testing

```bash
pnpm test
```

56 tests: errores Firebase (11 + genérico), validaciones (email, password, nombre 2–30 con regex, confirmación, fechas), taskService (exports + orden en batch), emailService (delegación propia + error-path + caso no-verificado, nunca AWS directo), orden manual (`mergeOrder`: mueve, conserva ocultos, casos inválidos), TodoForm (render + fecha/prioridad), TodoItem (render, checkbox, eliminar, vencida/prioridad), TodoList (vacío, tareas, email, filtros con conteo, toggle fallido, orden, toast específico), PasswordInput (ojo + error), ThemeToggle (alternancia + persistencia), Toast (mensaje), AuthRedirect (rebote con sesión en login y registro).

Servicios externos mockeados: ningún test hace llamadas reales. `tsconfig` incluye `tests/`, así que `tsc` también los tipa.

## Decisiones de arquitectura

- **Auth con contexto único:** un solo `onAuthStateChanged` en el provider `Authenticator`. `useAuth` consume el contexto con la misma firma. Acciones puras (`registerWithEmail`, `loginWithEmail`, `loginWithGoogle`, `logoutUser`).
- **Rebote con sesión:** login y registro redirigen a `/tasks` si ya hay sesión; el logo lleva a `/login` o `/tasks` según estado.
- **Timestamp → Date:** el mapper convierte a nativos con fallback para docs viejos (`null`/`media`/fecha de creación), sin migración.
- **Orden con completadas hundidas:** las tickeadas siempre abajo; el arrastre reordena dentro del mismo estado (cruzarlo rebota por diseño). `order` negativo en nuevos (`-Date.now()`) para que lo nuevo quede primero.
- **Drag & drop contenido:** asa dedicada (no roba clicks), sensor con distancia 8px, batch atómico al soltar, `mergeOrder` puro y testeado; táctil limitado al asa.
- **Service layer:** capas finas; los componentes describen UI. `emailService` nunca toca AWS.
- **Email con causa visible:** la function devuelve códigos blancos (`unverified-recipient`) en vez de texto AWS; el frontend los traduce. Nada sensible cruza al navegador.
- **Nombre visible:** `displayName` con `updateProfile`; header con fallback a email.
- **Tema por clase `.dark`:** variante custom Tailwind v4 + `localStorage` + preferencia del sistema.
- **`api/` y no `functions/`:** Vercel descubre las functions en `api/`.
- **Validación con causa:** cada freno explica el motivo; el error se limpia solo al volver válido el valor.

## Uso de IA

Usé IA como herramienta de velocidad, no de criterio: Antigravity (prototipado con el instructor), OpenCode (implementación guiada) y Claude (revisiones). La arquitectura, las decisiones (contexto único, fail-fast, orden manual, rewrites) y los criterios de verde fueron míos; verifiqué cada salida con comandos antes de commitear. Credenciales, deploys y renombres, siempre manuales.
