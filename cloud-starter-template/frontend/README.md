# FRONTEND

React + TypeScript single-page app built with Vite and served by nginx.

## Development

Start the backend on port 8080 (`uv run backend` in `backend/`), then:

```sh
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080`, so the app
always calls the API on its own origin.

## API types

Types are generated from the backend's OpenAPI schema, so the backend's
Pydantic models are the single source of truth:

```sh
npm run gen:api   # writes openapi.json and src/api/schema.ts
```

Run it whenever a backend model or route changes, and commit both files.

- `src/api/client.ts`: typed `openapi-fetch` client.
- `src/api/errors.ts`: `unwrap()` returns data or throws `ApiError`, which
  carries the backend's `ErrorResponse`.
- `src/api/items.ts`, `src/api/health.ts`: TanStack Query hooks per resource.
- `src/api/ApiProvider.tsx`: injects the client and query cache; tests pass a
  fake backend's `fetch` instead (see `src/test/`).

## Production

The Docker image builds the static bundle and serves it with unprivileged
nginx. At startup nginx proxies `/api/` to the backend URL set in `API_URL`.

| Variable  | Default | Purpose                                                           |
| --------- | ------- | ----------------------------------------------------------------- |
| `PORT`    | `8080`  | Listen port (set by Cloud Run).                                   |
| `API_URL` | none    | Backend base URL, e.g. `https://backend-xyz.a.run.app`. Required. |

## Checks

```sh
npm run typecheck
npm run lint        # Biome: lint, formatting and import order
npm test
```

`npm run lint:fix` applies Biome's safe fixes (formatting, import order).
