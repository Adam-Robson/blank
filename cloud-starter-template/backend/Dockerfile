# base
FROM python:3.13.4-slim

# uv install
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# optimize python
ENV UV_COMPILE_BYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /backend

# copy dep manifest
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev

# expose virtual env
ENV PATH="/app/.venv/bin:$PATH"

# uvicorn bound to Cloud Run's $PORT
CMD exec uvicorn backend.main:main --host 0.0.0.0 --port $PORT
