# Meridia — personal finance web app (Monorepo)

npm workspaces: `apps/api` (Express + Zod + pg), `apps/web` (React 19 + Vite + TanStack Router + MUI + TanStack Query), `packages/shared` (shared types/enums, no runtime logic).

## Commands (run from repo root)

- `npm run dev` — api (`tsx watch src/server.ts`, :4000) + web (Vite, :5173) via concurrently. Vite proxies `/api` and `/health` to :4000.
- `npm run lint` — ESLint 9 flat config across workspaces (`no-explicit-any` and unused-vars are errors).
- `npm run format` / `npm run format:check` — Prettier.
- `npm test` — runs tests in every workspace (API and web both have vitest suites).
- Per-workspace: `npm run typecheck` (api: `tsc --noEmit`; web: `tsc -b --noEmit`).
- DB: `npm run db:create`, `npm run db:migrate` (arg `up`/`down`/`status`). Migrations SQL in `database/migrations/`, applied in filename order, tracked in `schema_migrations`.
- Health check: `/health` (NOT `/api/health`).

## `@meridia/shared` — rebuild after editing

Consumers resolve shared via built `dist/` (`main`/`types` point there; `dist` is gitignored). `postinstall` builds it. After changing `packages/shared/src`, run `npm run build -w @meridia/shared` or consumers' typecheck will fail with "has no exported member".

## API architecture

- Per module (`modules/*`): `routes` → `controller` → `service` → `repository`, plus `*.schemas.ts` (zod) and `*.repository.ts` (SQL + `map*Row` converting snake_case rows → camelCase domain).
- The `validate` middleware replaces `req.params`/`req.query`/`req.body` with parsed zod output, so controllers read plain strings and cast to branded ids.
- **Branded IDs** (`UserId`, `AccountId`, `CategoryId`, `TransactionId`) come from shared. Service/repository signatures use them; casts allowed only at boundaries (controller `req.params.id as XId`, `map*Row`), never in domain code.
- Response envelope: `{ success: true, data }`. List → `data.items` + `data.total`; create → `data.{account|category|transaction}`; auth → `data.user` + `data.accessToken`; dashboard → `data.dashboard`. Errors → `data.error.{code,message,details}`.
- Refresh token lives in an httpOnly cookie; access token is returned in the body and sent as `Authorization: Bearer`.
- env parsed by zod in `src/config/env.ts`; a custom loader walks up to the root `.env` (only sets unset vars). Root `.env` is required (contains `DATABASE_URL`); dev `RATE_LIMIT_MAX=20` is overridden to 1000 in tests.

## API tests

- Run from `apps/api` (`npm test`). Requires a running Postgres and root `.env`.
- `globalSetup` auto-creates `meridia_test` and applies migrations in-process; `setup.ts` rewrites env (`DATABASE_URL`→`meridia_test`, `NODE_ENV=test`, `PG_SSL=false`).
- **`fileParallelism: false` is required** — parallel workers share `meridia_test` and their TRUNCATEs deadlock. Keep it.
- `vitest.config.ts` uses relative paths in `globalSetup`/`setupFiles`; `<rootDir>` interpolation does NOT work here.
- Clear between tests with `truncateAll()` (`src/test/db.ts`). Helpers `register`/`registerAndLogin` in `src/test/helpers.ts`; the returned agent persists auth via `agent.set('Authorization', ...)`.

## Web — TanStack Router + TanStack Query

**File-based TanStack Router**. `npm run routes:gen` regenerates `src/routeTree.gen.ts` — it is TRACKED (commit changes) but lint-ignored.

**TanStack Query integration**:

- Query client: `apps/web/src/services/query/queryClient.ts` — creates `QueryClient` with `staleTime: 5min`, `gcTime: 30min`, retry defaults. Exposed globally via `window.__TANSTACK_QUERY_CLIENT__`.
- Query client provided through `QueryClientProvider` in `apps/web/src/app/providers/AppProviders.tsx`.
- **`useQuery` hooks** (in `apps/web/src/hooks/`): `useCurrentUser`, `useListAccounts`, `useListCategories`, `useListTransactions`, `useDashboardSummary`. Each wraps an API endpoint via `services/api/client.ts`.
- **`useMutation` hooks** (in `apps/web/src/hooks/`): auth (login/register/logout/updateProfile), accounts (create/update/delete), categories (create/update/delete), transactions (create/update/delete). All use `apiClient` with automatic token refresh.
- **Query invalidation**: mutations invalidate related queries (e.g., transaction mutations invalidate transactions, accounts, and dashboard queries). See `apps/web/src/services/query/invalidations/transactionInvalidations.ts`.
- Route guards use `queryClient.query()` to check auth state before rendering. `beforeLoad` in public/login redirects authenticated users to dashboard; `beforeLoad` in app/route redirects unauthenticated to login.

**MUI deep imports only**: `import Button from '@mui/material/Button'`, icons `@mui/icons-material/<Name>`, theme hooks/`createTheme` from `@mui/material/styles`, `useMediaQuery` from `@mui/material/useMediaQuery`. Never import from the `@mui/material` barrel. Props types live in the component module (`import type { TextFieldProps } from '@mui/material/TextField'`), not a `<Name>Props` subpath.

- State: zustand stores (`uiStore`).
- `@` alias → `apps/web/src`.
- UI copy is Spanish (and API error messages are Spanish).

## Gotchas

- `.agents/skills/` holds the installed skill set that defines project conventions.
- ESLint: `@typescript-eslint/no-unused-vars` allows `^_` prefixed args; `no-explicit-any` is an error.
- `routeTree.gen.ts` must exist for web `tsc -b`; regenerate with `routes:gen` if missing/stale.
- Don't touch `package-lock.json` casually; the root install uses workspaces + `postinstall` shared build.
- TanStack Query `queryClient` is created in `services/query/queryClient.tsx` — do not recreate or the global `window.__TANSTACK_QUERY_CLIENT__` will be stale.
- Mutations must call `invalidateQueries` on success (see invalidations directory) to keep caches consistent.
- Route guards in `(public)/login.tsx` and `app/route.tsx` are the auth entry/exit points — beforeLoad hooks query the queryClient to determine redirect.
