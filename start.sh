#!/bin/bash
# Wisp Instant - Startup Script for macOS
set -euo pipefail

WISP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROUTER_ENV="$WISP_DIR/router/server/.env"
SRC_ENV_LOCAL="$WISP_DIR/src/.env.local"

echo "Starting Wisp Instant..."
echo ""

if [ ! -f "$ROUTER_ENV" ]; then
  echo "Error: missing required env file: $ROUTER_ENV"
  echo "Create it first, for example:"
  echo "  cp \"$WISP_DIR/.env\" \"$ROUTER_ENV\""
  exit 1
fi

ensure_env_kv() {
  local file="$1"
  local key="$2"
  local value="$3"
  if grep -q "^${key}=" "$file"; then
    sed -i '' "s#^${key}=.*#${key}=${value}#g" "$file"
  else
    printf "\n%s=%s\n" "$key" "$value" >> "$file"
  fi
}

read_env_value() {
  local file="$1"
  local key="$2"
  python3 - "$file" "$key" <<'PY'
import sys
from pathlib import Path

env_file = Path(sys.argv[1])
target = sys.argv[2]
value = ""
if env_file.exists():
    for raw in env_file.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        if k != target:
            continue
        v = v.strip()
        if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
            v = v[1:-1]
        value = v
print(value, end="")
PY
}

load_runtime_env() {
  SITE_URL="$(read_env_value "$ROUTER_ENV" "SITE_URL")"
  MCP_PROXY_URL="$(read_env_value "$ROUTER_ENV" "MCP_PROXY_URL")"
  GOOGLE_GEMINI_BASE_URL="$(read_env_value "$ROUTER_ENV" "GOOGLE_GEMINI_BASE_URL")"
  GEMINI_MODEL="$(read_env_value "$ROUTER_ENV" "GEMINI_MODEL")"
  GEMINI_CHAT_COMPLETIONS_URL="$(read_env_value "$ROUTER_ENV" "GEMINI_CHAT_COMPLETIONS_URL")"
  GEMINI_API_KEY="$(read_env_value "$ROUTER_ENV" "GEMINI_API_KEY")"
  BROWSER_USE_API_KEY="$(read_env_value "$ROUTER_ENV" "BROWSER_USE_API_KEY")"
  AUTH_GOOGLE_ID="$(read_env_value "$ROUTER_ENV" "AUTH_GOOGLE_ID")"
  AUTH_GOOGLE_SECRET="$(read_env_value "$ROUTER_ENV" "AUTH_GOOGLE_SECRET")"
  JWT_PRIVATE_KEY="$(read_env_value "$ROUTER_ENV" "JWT_PRIVATE_KEY")"
  JWKS="$(read_env_value "$ROUTER_ENV" "JWKS")"
}

load_runtime_env

# Hard guard: Browser Use key must exist in router/server/.env
if [ -z "${BROWSER_USE_API_KEY:-}" ]; then
  echo "Error: missing BROWSER_USE_API_KEY in $ROUTER_ENV"
  echo "Add this line and re-run:"
  echo "  BROWSER_USE_API_KEY=your_browser_use_key"
  exit 1
fi

# Defaults for local startup
SITE_URL="${SITE_URL:-http://localhost:3001}"
MCP_PROXY_URL="${MCP_PROXY_URL:-http://localhost:8000}"
GOOGLE_GEMINI_BASE_URL="${GOOGLE_GEMINI_BASE_URL:-https://once.novai.su}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"
GEMINI_CHAT_COMPLETIONS_URL="${GEMINI_CHAT_COMPLETIONS_URL:-${GOOGLE_GEMINI_BASE_URL%/}/v1/chat/completions}"

ensure_env_kv "$ROUTER_ENV" "SITE_URL" "$SITE_URL"
ensure_env_kv "$ROUTER_ENV" "MCP_PROXY_URL" "$MCP_PROXY_URL"
ensure_env_kv "$ROUTER_ENV" "GOOGLE_GEMINI_BASE_URL" "$GOOGLE_GEMINI_BASE_URL"
ensure_env_kv "$ROUTER_ENV" "GEMINI_MODEL" "$GEMINI_MODEL"
ensure_env_kv "$ROUTER_ENV" "GEMINI_CHAT_COMPLETIONS_URL" "$GEMINI_CHAT_COMPLETIONS_URL"

# Reload after defaults
load_runtime_env

# Ensure JWT keys exist for @convex-dev/auth (runtime only; do not write back to .env)
if [ -z "${JWT_PRIVATE_KEY:-}" ] || [ -z "${JWKS:-}" ]; then
  echo "JWT_PRIVATE_KEY/JWKS missing in router env, generating ephemeral values for this run ..."
  TMP_JWT_DIR="$(mktemp -d)"
  python3 - "$TMP_JWT_DIR" <<'PY'
import base64
import json
import pathlib
import sys
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

out_dir = pathlib.Path(sys.argv[1])
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_numbers = private_key.public_key().public_numbers()

def b64url_uint(n: int) -> str:
    b = n.to_bytes((n.bit_length() + 7) // 8, "big")
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")

pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
).decode("utf-8")

jwks = {
    "keys": [{
        "kty": "RSA",
        "n": b64url_uint(public_numbers.n),
        "e": b64url_uint(public_numbers.e),
        "use": "sig",
        "alg": "RS256",
    }]
}

(out_dir / "jwt_private_key.pem").write_text(pem)
(out_dir / "jwks.json").write_text(json.dumps(jwks, separators=(",", ":")))
PY
  JWT_PRIVATE_KEY="$(cat "$TMP_JWT_DIR/jwt_private_key.pem")"
  JWKS="$(cat "$TMP_JWT_DIR/jwks.json")"
  rm -rf "$TMP_JWT_DIR"
fi

for required in GEMINI_API_KEY BROWSER_USE_API_KEY AUTH_GOOGLE_ID AUTH_GOOGLE_SECRET; do
  if [ -z "${!required:-}" ]; then
    echo "Error: missing $required in $ROUTER_ENV"
    exit 1
  fi
done

mkdir -p "$WISP_DIR/src"
if [ ! -f "$SRC_ENV_LOCAL" ]; then
  cat > "$SRC_ENV_LOCAL" <<'EOF'
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=anonymous:anonymous-src
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211
EOF
fi

echo "Environment check passed"
echo "Opening 4 Terminal windows..."
echo ""

# Terminal 1: Router (MCP Gateway :8000)
osascript -e "tell application \"Terminal\"" \
          -e "activate" \
          -e "do script \"cd '$WISP_DIR/router' && echo '🎯 Router (MCP Gateway) :8000' && uv run python server.py\"" \
          -e "end tell" > /dev/null
sleep 1

# Terminal 2: Orchestrator (:8001)
osascript -e "tell application \"Terminal\"" \
          -e "activate" \
          -e "do script \"cd '$WISP_DIR/server' && echo '🎯 Orchestrator :8001' && uv run python main.py\"" \
          -e "end tell" > /dev/null
sleep 1

# Terminal 3: Convex (local backend)
osascript -e "tell application \"Terminal\"" \
          -e "activate" \
          -e "do script \"cd '$WISP_DIR/src' && echo '🎯 Convex Backend' && npx convex dev\"" \
          -e "end tell" > /dev/null

echo "Waiting for Convex local deployment on :3210 ..."
for i in $(seq 1 30); do
  if curl -sSf "http://127.0.0.1:3210/version" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "Syncing env vars to Convex dev deployment ..."
sync_convex_env() {
  local key="$1"
  local value="${!key:-}"
  if [ -n "$value" ]; then
    (cd "$WISP_DIR/src" && npx convex env set "$key" -- "$value") >/dev/null
    echo "  ✓ $key"
  fi
}

sync_convex_env SITE_URL
sync_convex_env JWT_PRIVATE_KEY
sync_convex_env JWKS
sync_convex_env GEMINI_API_KEY
sync_convex_env GOOGLE_GEMINI_BASE_URL
sync_convex_env GEMINI_MODEL
sync_convex_env GEMINI_CHAT_COMPLETIONS_URL
sync_convex_env MCP_PROXY_URL
sync_convex_env BROWSER_USE_API_KEY
sync_convex_env AUTH_GOOGLE_ID
sync_convex_env AUTH_GOOGLE_SECRET

# Terminal 4: Frontend (:3001)
osascript -e "tell application \"Terminal\"" \
          -e "activate" \
          -e "do script \"cd '$WISP_DIR/src' && echo '🎯 Frontend :3001' && npm run dev\"" \
          -e "end tell" > /dev/null

echo ""
echo "4 Terminal windows opened"
echo "Open http://localhost:3001 in your browser"
echo ""
echo "Service URLs:"
echo "  - Frontend:     http://localhost:3001"
echo "  - Orchestrator: http://localhost:8001"
echo "  - Router:       http://localhost:8000"
echo "  - Convex:       http://127.0.0.1:3210"
echo ""
echo "If you still see 'Not authenticated', sign in again in the web UI after startup."
