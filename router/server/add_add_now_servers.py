#!/usr/bin/env python3
"""
Upsert the "MCP add-now" server set into mcp_registry.db.

Data source:
- router/server/mcp_data.json (server metadata, packages, remotes, env vars)
- add_github_mcp.py (custom GitHub registration path already used in this repo)
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).parent
DATABASE_PATH = BASE_DIR / "mcp_registry.db"
MCP_DATA_PATH = BASE_DIR / "mcp_data.json"

# Prioritized "add-now" MCP servers for Wisp.
ADD_NOW_SERVER_NAMES = [
    # Tier 1
    "io.github.domdomegg/gmail-mcp",
    "com.mintmcp/gmail",
    "io.github.stevenvo/slack-mcp-server",
    "ai.smithery/smithery-ai-slack",
    "com.notion/mcp",
    "io.github.henilcalagiya/google-sheets-mcp",
    "io.github.domdomegg/google-sheets-mcp",
    # Tier 2 (next wave)
    "com.mintmcp/gcal",
    "com.atlassian/atlassian-mcp-server",
    "app.linear/linear",
    "io.github.Oratorian/discord-node-mcp",
    "com.stripe/mcp",
    "io.github.bytebase/dbhub",
    "ai.waystation/postgres",
]


def _as_json(value) -> str | None:
    if value is None:
        return None
    return json.dumps(value)


def _pick_env_name(env: dict) -> str | None:
    return (
        env.get("var_name")
        or env.get("name")
        or env.get("key")
        or env.get("id")
    )


def _boolish(value) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value != 0
    if isinstance(value, str):
        return value.lower() in {"1", "true", "yes", "on"}
    return False


def load_server_index() -> dict[str, dict]:
    with MCP_DATA_PATH.open("r", encoding="utf-8") as f:
        root = json.load(f)
    servers = root.get("servers", root if isinstance(root, list) else [])
    return {s.get("name"): s for s in servers if s.get("name")}


def upsert_server(cursor: sqlite3.Cursor, server: dict) -> None:
    name = server["name"]
    now = datetime.now().isoformat()

    cursor.execute(
        """
        INSERT INTO servers (
            name, description, version, schema_url, repository_url, repository_source,
            website_url, is_latest, status, published_at, updated_at, raw_json, extracted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            description=excluded.description,
            version=excluded.version,
            schema_url=excluded.schema_url,
            repository_url=excluded.repository_url,
            repository_source=excluded.repository_source,
            website_url=excluded.website_url,
            is_latest=excluded.is_latest,
            status=excluded.status,
            published_at=excluded.published_at,
            updated_at=excluded.updated_at,
            raw_json=excluded.raw_json,
            extracted_at=excluded.extracted_at
        """,
        (
            name,
            server.get("description"),
            server.get("version"),
            server.get("schema_url"),
            server.get("repository_url"),
            server.get("repository_source"),
            server.get("website_url"),
            1 if _boolish(server.get("is_latest", True)) else 0,
            server.get("status"),
            server.get("published_at"),
            server.get("updated_at"),
            _as_json(server),
            now,
        ),
    )

    # Replace metadata children to keep current with registry snapshot.
    cursor.execute("DELETE FROM server_packages WHERE server_name = ?", (name,))
    cursor.execute("DELETE FROM server_remotes WHERE server_name = ?", (name,))
    cursor.execute("DELETE FROM environment_variables WHERE server_name = ?", (name,))

    for pkg in server.get("packages", []) or []:
        cursor.execute(
            """
            INSERT INTO server_packages
            (server_name, registry_type, identifier, version, transport_type,
             transport_url, runtime_hint, file_sha256, raw_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                name,
                pkg.get("registry_type"),
                pkg.get("identifier"),
                pkg.get("version"),
                pkg.get("transport_type"),
                pkg.get("transport_url"),
                pkg.get("runtime_hint"),
                pkg.get("file_sha256"),
                _as_json(pkg),
            ),
        )

    for remote in server.get("remotes", []) or []:
        cursor.execute(
            """
            INSERT INTO server_remotes
            (server_name, transport_type, url, headers_json)
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                remote.get("transport_type"),
                remote.get("url"),
                _as_json(remote.get("headers")),
            ),
        )

    for env in server.get("environment_variables", []) or []:
        env_name = _pick_env_name(env)
        if not env_name:
            continue
        cursor.execute(
            """
            INSERT INTO environment_variables
            (server_name, var_name, description, is_required, is_secret, format, default_value, choices)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                name,
                env_name,
                env.get("description"),
                1 if _boolish(env.get("is_required")) else 0,
                1 if _boolish(env.get("is_secret")) else 0,
                env.get("format"),
                env.get("default"),
                _as_json(env.get("enum") or env.get("choices")),
            ),
        )


def main() -> None:
    server_index = load_server_index()
    missing = [name for name in ADD_NOW_SERVER_NAMES if name not in server_index]
    if missing:
        raise SystemExit(f"Missing servers in mcp_data.json: {missing}")

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    inserted = 0
    for name in ADD_NOW_SERVER_NAMES:
        upsert_server(cursor, server_index[name])
        inserted += 1
        print(f"  upserted: {name}")

    conn.commit()
    conn.close()

    print(f"\nDone. Upserted {inserted} add-now servers into {DATABASE_PATH.name}.")
    print("Run add_github_mcp.py separately for the repo's GitHub alias server.")


if __name__ == "__main__":
    main()
