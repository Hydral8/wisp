# --- Wisp MCP Proxy (stateless) ---
FROM python:3.13-slim AS base

# Install Node.js LTS and uv in a single layer, clean up apt cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge -y --auto-remove curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY pyproject.toml ./
RUN uv sync --no-dev --no-cache && rm -rf /root/.cache

COPY server.py ./

EXPOSE 8000

HEALTHCHECK --interval=60s --timeout=5s --retries=2 \
    CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uv", "run", "python", "server.py"]
