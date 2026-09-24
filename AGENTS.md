# AGENTS.md — MateCode (rama `main`)

Guía para agentes que trabajan en este repo. Leer antes de tocar código.

## Proyecto

SPA React 19 + TypeScript + Vite 8 + Tailwind v4, Firebase Auth/Firestore, AWS SES vía Vercel Function en `api/`, Vitest + RTL. Gestor pnpm (nunca npm).

## Comandos

```bash
pnpm install   # deps (los build-scripts ya están aprobados)
pnpm dev       # desarrollo
pnpm build     # tsc -b + vite build
pnpm test      # vitest run, debe quedar en verde
pnpm exec tsc -b  # tipado, debe quedar en 0 errores
```

## Convenciones (no negociables sin motivo)

- `VITE_*` solo frontend. `AWS_*` sin prefijo solo serverless (`api/`). Jamás secretos en frontend ni en commits.
- `api/` y no `functions/`: Vercel descubre functions en `api/`.
- Capas: `components/` UI, `features/` dominio (auth), `services/` integraciones, `hooks/` estado/suscripciones con cleanup, `pages/` vistas, `routes/` router, `types/` dominio (`Task`, `TaskFormValues`), `utils/` validaciones puras, `styles/theme.ts` clases compartidas.
- `Task` usa `Date` nativos; el mapper `Timestamp→Date` vive en `taskService` y es null-safe.
- Auth: un solo `onAuthStateChanged` en el provider `Authenticator`. `useAuth` conserva firma `{user, loading}`. Acciones puras en el mismo módulo.
- Errores Firebase por catálogo `traducirError`/`getErrorCode`, nunca códigos crudos ni `any`.
- Estilo Tailwind con `dark:` en cada superficie nueva. Marca en `Logo`, nada de texto de marca suelto.
- Español rioplatense en UI, comments `// Frase corta` y commits `tipo: frase corta` en minúscula.

## Reglas de trabajo

- Un incremento = implementar → `tsc` 0 → `vitest` verde → commit chico. Nunca commitear en rojo.
- Tests para comportamiento nuevo o corregido. Mocks de Firebase/hooks, sin llamadas reales.
- No tocar: `.env` (ni leerlo), branch `matecode-legacy`, settings de GitHub/Vercel. `dev/MateCode` es worktree de `main` (el repo vive en el clon de referencia).
- Sin `--force`, sin amend de commits pusheados, sin carpetas vacías.
- Dudas de diseño o alcance: preguntar antes de aplicar.
