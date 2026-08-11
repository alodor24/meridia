# Meridia — personal finance web app (Monorepo)

npm workspaces: `apps/api` (Express + Zod + pg), `apps/web` (React 19 + Vite + TanStack Router + MUI), `packages/shared` (shared types/enums, no runtime logic).

## Commands (run from repo root unless noted)

- `npm run dev` — api (`tsx watch src/server.ts`, :4000) + web (Vite, :5173) via concurrently. Vite proxies `/api` and `/health` to :4000.
- `npm run lint` — ESLint 9 flat config across workspaces (`no-explicit-any` and unused-vars are errors).
- `npm run format` / `npm run format:check` — Prettier.
- `npm test` — runs tests in every workspace (API and web both have vitest suites).
- Per-workspace: `npm run typecheck` (api: `tsc --noEmit`; web: `tsc -b --noEmit`).
- DB: `npm run db:create`, `npm run db:migrate` (arg `up`/`down`/`status`). Migrations are SQL files in `database/migrations/`, applied in filename order, tracked in `schema_migrations`.
- Health check is `/health` (NOT `/api/health`).

## `@meridia/shared` — rebuild after editing

Consumers resolve shared via built `dist/` (`main`/`types` point there; `dist` is gitignored). `postinstall` builds it. After changing `packages/shared/src`, run `npm run build -w @meridia/shared` or consumers' typecheck will fail with "has no exported member".

## API architecture

- Per module (`modules/*`): `routes` → `controller` → `service` → `repository`, plus `*.schemas.ts` (zod) and `*.repository.ts` (SQL + `map*Row` converting snake_case rows → camelCase domain).
- The `validate` middleware replaces `req.params`/`req.query`/`req.body` with parsed zod output, so controllers read plain strings and cast to branded ids.
- **Branded IDs** (`UserId`, `AccountId`, `CategoryId`, `TransactionId`) come from shared. Service/repository signatures use them; casts are allowed only at boundaries (controller `req.params.id as XId`, `map*Row`), never in domain code.
- Response envelope: `{ success: true, data }`. List → `data.items` + `data.total`; create → `data.{account|category|transaction}`; auth → `data.user` + `data.accessToken`; dashboard → `data.dashboard`. Errors → `data.error.{code,message,details}`.
- Refresh token lives in an httpOnly cookie; access token is returned in the body and sent as `Authorization: Bearer`.
- env parsed by zod in `src/config/env.ts`; a custom loader walks up to the root `.env` (only sets unset vars). Root `.env` is required (contains `DATABASE_URL`); dev `RATE_LIMIT_MAX=20` is overridden to 1000 in tests.

## API tests

- Run from `apps/api` (`npm test`). Requires a running Postgres and root `.env`.
- `globalSetup` auto-creates `meridia_test` and applies migrations in-process; `setup.ts` rewrites env (`DATABASE_URL`→`meridia_test`, `NODE_ENV=test`, `PG_SSL=false`).
- **`fileParallelism: false` is required** — parallel workers share `meridia_test` and their TRUNCATEs deadlock. Keep it.
- `vitest.config.ts` uses relative paths in `globalSetup`/`setupFiles`; `<rootDir>` interpolation does NOT work here.
- Clear between tests with `truncateAll()` (`src/test/db.ts`). Helpers `register`/`registerAndLogin` in `src/test/helpers.ts`; the returned agent persists auth via `agent.set('Authorization', ...)`.

## Web

- File-based TanStack Router. `npm run routes:gen` regenerates `src/routeTree.gen.ts` — it is TRACKED (commit changes) but lint-ignored.
- **MUI deep imports only**: `import Button from '@mui/material/Button'`, icons `@mui/icons-material/<Name>`, theme hooks/`createTheme` from `@mui/material/styles`, `useMediaQuery` from `@mui/material/useMediaQuery`. Never import from the `@mui/material` barrel. Props types live in the component module (`import type { TextFieldProps } from '@mui/material/TextField'`), not a `<Name>Props` subpath.
- State: zustand stores (`authStore`, `uiStore`). Data fetching: `useFetch`/`useAsyncAction` from `hooks/useAsync`. Forms: Formik + Yup. HTTP: axios wrapper in `services/api/client.ts` (handles token refresh).
- `@` alias → `apps/web/src`.
- UI copy is Spanish (and API error messages are Spanish).

## Gotchas

- `.agents/skills/` holds the installed skill set that defines project conventions.
- ESLint: `@typescript-eslint/no-unused-vars` allows `^_` prefixed args; `no-explicit-any` is an error.
- `routeTree.gen.ts` must exist for web `tsc -b`; regenerate with `routes:gen` if missing/stale.
- Don't touch `package-lock.json` casually; the root install uses workspaces + `postinstall` shared build.
