# CLOUD-STARTER-TEMPLATE

## Instructions

1. No file should exceed 200 lines.
2. Employ SOLID programming principles.
3. Use single quotes for strings & docstrings.
4. Do not circumvent the linter with comments,
   or other shortcuts.
5. Do not mask the underlying issue; find the root
   cause of the issue and solve it promptly.
6. Follow the established conventions in the
   project.

## Repository

- `backend/`: Python API (FastAPI), deployed to Cloud Run.
- `frontend/`: React + TypeScript SPA (Vite), served by
  nginx on Cloud Run.
- The browser only talks to `/api` on its own origin:
  the Vite dev server and nginx proxy it to the backend.
- Work on `dev`; open PRs against `main`.
- Commit messages: short, lowercase, imperative
  (e.g. `add ...`, `update ...`).

## Backend Conventions

### Backend Tooling

- Managed by uv; run commands from `backend/`.
- Python >= 3.13; use PEP 695 generics
  (`class Page[T]`, `def get[T](...)`), not `TypeVar`.
- Source uses the src layout: `src/backend/<package>/`.
- Ruff: line length 80, single quotes (including
  `'''` docstrings and TOML values in `pyproject.toml`).
- mypy strict covers `src` and `test`; annotate every
  function, including tests and fixtures.

### Backend Structure

- Each package re-exports its public API from
  `__init__.py` with an explicit `__all__`; import
  from the package (`from backend.lib.models import ...`).
  Never re-export a name that matches a submodule
  (it hides the module); the `backend` and
  `backend.lib` packages re-export nothing.
- `backend.lib`: shared definitions used across the
  app. Models and exceptions live here, not in the
  packages that use them.
- `backend.lib.models`: HTTP payload shapes. Subclass
  `ApiModel`: snake_case in Python, camelCase on the
  wire, frozen, unknown fields ignored. Use `Page[T]`
  for paginated lists and `ErrorResponse` for errors.
- `backend.lib.exceptions`: exception classes, plus
  `EXCEPTION_HANDLERS`, which return every error
  response (including 422s) in the `ErrorResponse`
  shape.
- `backend.clients`: outbound HTTP. Async only.
  Subclass `AsyncHttpClient` once per upstream service
  and expose typed methods; never call `httpx` directly.
  - `send()` returns the raw response.
  - `request()` and `get`, `post`, `put` and `patch`
    validate the body into a `response_model`.
  - `delete()` returns `None`.
  - Failures raise `HttpStatusError` or
    `HttpTransportError`, both subclasses of
    `HttpClientError` (from `backend.lib.exceptions`).

- `backend.app.create_app(settings, ...)`: builds the
  FastAPI app; inject dependencies through its arguments.
  `backend.main` loads `.env`, builds `Settings` and
  exposes `app` (the object uvicorn serves).
- `backend.config.Settings`: all configuration, read
  from the environment (`CORS_ORIGINS`, `PORT`).
- `backend.services`: standalone tasks, e.g.
  `export_openapi` (the `export-openapi` command).
- `backend.routes`: one `APIRouter` per resource, all
  mounted under `/api`. Return models directly from
  typed handlers; raise `HTTPException` for errors.
  The OpenAPI schema is the frontend's contract; after
  changing a model or route, run `npm run gen:api` in
  `frontend/`.
- `backend.db`: storage behind a `Protocol`
  (e.g. `ItemRepository`); routes depend on the
  protocol, never on a concrete store.

### Backend Testing

- pytest with `asyncio_mode = auto`: write
  `async def test_...` without decorators.
- Tests live in `backend/test/` as `test_*.py`.
- Never hit the network: stub HTTP with
  `httpx.MockTransport` by overriding the
  `http_transport` fixture from `conftest.py`.
- Test routes in-process with the `api_client`
  fixture, which uses `httpx.ASGITransport`.
- Share values through fixtures; don't import from
  `conftest`.
- Keep coverage on new code at 100%.

### Backend Checks (all must pass before committing)

```sh
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest
```

## Frontend Conventions

### Frontend Tooling

- npm; run commands from `frontend/`.
- TypeScript strict; Prettier with single quotes
  (including JSX); ESLint flat config.
- No `as` casts or `!` assertions to silence the type
  checker; narrow with checks or type guards.

### Frontend Structure

- `src/api/schema.ts` and `openapi.json` are generated
  by `npm run gen:api`; never edit them by hand.
- `src/api/types.ts`: friendly aliases for schema types.
- Call the API only through hooks in `src/api/`
  (TanStack Query), one file per resource. Wrap every
  call in `unwrap()`, which throws `ApiError`.
- Get the client from `useApiClient()`; it is injected
  by `ApiProvider`, never imported as a singleton.
- `src/components/`: one component per file, named
  exports; `App.tsx` composes them.

### Frontend Testing

- Vitest + Testing Library, `*.test.ts(x)` next to the
  code under test.
- Render with `renderWithApi(ui, backend.fetch)` and a
  `createFakeBackend()` from `src/test/`; never mock
  hooks or hit the network.

### Frontend Checks (all must pass before committing)

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
```
