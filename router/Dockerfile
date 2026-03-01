# --- Wisp MCP Proxy (stateless) ---
FROM python:3.13-slim AS base

# Install Node.js LTS and uv in a single layer, clean up apt cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates git \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge -y --auto-remove curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY --from=ghcr.io/astral-sh/uv:latest /uvx /usr/local/bin/uvx

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Python dependencies
COPY pyproject.toml ./
RUN uv sync --no-dev --no-cache && rm -rf /root/.cache

# ---------------------------------------------------------------------------
# Pre-install MCP server packages so npx/uvx hits warm cache at runtime.
# Failures are tolerated — some packages may be platform-specific.
# ---------------------------------------------------------------------------

# npm: global install so npx resolves without downloading
COPY preinstall_npm.txt ./
RUN while IFS= read -r pkg || [ -n "$pkg" ]; do \
      [ -z "$pkg" ] && continue; \
      echo "Installing npm: $pkg"; \
      npm install -g "$pkg" 2>&1 | tail -1 || true; \
    done < preinstall_npm.txt \
    && npm cache clean --force 2>/dev/null || true

# pypi: uv tool install so uvx resolves without downloading
COPY preinstall_pypi.txt ./
RUN while IFS= read -r pkg || [ -n "$pkg" ]; do \
      [ -z "$pkg" ] && continue; \
      echo "Installing pypi: $pkg"; \
      uv tool install "$pkg" 2>&1 | tail -1 || true; \
    done < preinstall_pypi.txt \
    && rm -rf /root/.cache/uv/sdists 2>/dev/null || true

# ---------------------------------------------------------------------------

COPY server.py ./

EXPOSE 8000

HEALTHCHECK --interval=60s --timeout=5s --retries=2 \
    CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uv", "run", "python", "server.py"]
