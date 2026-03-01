#!/usr/bin/env python3
"""
Export MCP registry data from SQLite to JSON files for Convex migration.

Usage:
    python scripts/export_registry.py

Outputs:
    scripts/data/servers.json
    scripts/data/server_packages.json
    scripts/data/server_remotes.json
    scripts/data/environment_variables.json
    scripts/data/tools.json
    scripts/data/tool_embeddings.json  (768D float vectors)
"""

import json
import sqlite3
import struct
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "router" / "server" / "mcp_registry.db"
OUT_DIR = Path(__file__).resolve().parent / "data"
OUT_DIR.mkdir(exist_ok=True)


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    # Load sqlite-vec for reading embeddings
    try:
        import sqlite_vec
        conn.enable_load_extension(True)
        sqlite_vec.load(conn)
    except Exception:
        print("Warning: sqlite-vec not available, embeddings export may fail")
    return conn


def export_servers(conn):
    rows = conn.execute(
        "SELECT name, COALESCE(description,'') as description, "
        "COALESCE(version,'') as version, COALESCE(repository_url,'') as repository_url, "
        "COALESCE(status,'active') as status FROM servers"
    ).fetchall()
    data = [dict(r) for r in rows]
    with open(OUT_DIR / "servers.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} servers")


def export_server_packages(conn):
    rows = conn.execute(
        "SELECT server_name, COALESCE(registry_type,'') as registry_type, "
        "COALESCE(identifier,'') as identifier, COALESCE(transport_type,'') as transport_type, "
        "COALESCE(runtime_hint,'') as runtime_hint FROM server_packages"
    ).fetchall()
    data = [
        {
            "serverName": r["server_name"],
            "registryType": r["registry_type"],
            "identifier": r["identifier"],
            "transportType": r["transport_type"],
            "runtimeHint": r["runtime_hint"],
        }
        for r in rows
    ]
    with open(OUT_DIR / "server_packages.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} server packages")


def export_server_remotes(conn):
    rows = conn.execute(
        "SELECT server_name, COALESCE(transport_type,'') as transport_type, "
        "COALESCE(url,'') as url, COALESCE(headers_json,'') as headers_json "
        "FROM server_remotes"
    ).fetchall()
    data = [
        {
            "serverName": r["server_name"],
            "transportType": r["transport_type"],
            "url": r["url"],
            "headersJson": r["headers_json"],
        }
        for r in rows
    ]
    with open(OUT_DIR / "server_remotes.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} server remotes")


def export_environment_variables(conn):
    rows = conn.execute(
        "SELECT server_name, var_name, "
        "COALESCE(is_secret,0) as is_secret, COALESCE(is_required,0) as is_required "
        "FROM environment_variables"
    ).fetchall()
    data = [
        {
            "serverName": r["server_name"],
            "varName": r["var_name"],
            "isSecret": bool(r["is_secret"]),
            "isRequired": bool(r["is_required"]),
        }
        for r in rows
    ]
    with open(OUT_DIR / "environment_variables.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} environment variables")


def export_tools(conn):
    rows = conn.execute(
        "SELECT id, server_name, tool_name, COALESCE(title,'') as title, "
        "COALESCE(description,'') as description, COALESCE(input_schema,'{}') as input_schema "
        "FROM tools"
    ).fetchall()
    data = [
        {
            "sqlite_id": r["id"],
            "serverName": r["server_name"],
            "toolName": r["tool_name"],
            "title": r["title"],
            "description": r["description"],
            "inputSchema": r["input_schema"],
        }
        for r in rows
    ]
    with open(OUT_DIR / "tools.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} tools")


def export_tool_embeddings(conn):
    """Export embeddings from sqlite-vec virtual table."""
    try:
        rows = conn.execute(
            "SELECT ts.tool_id, ts.full_doc, te.embedding "
            "FROM tools_search ts "
            "JOIN tool_embeddings te ON ts.tool_id = te.tool_id"
        ).fetchall()
    except Exception as e:
        print(f"Warning: Could not export embeddings: {e}")
        print("Falling back to tools_search only (embeddings will need to be regenerated)")
        rows = conn.execute(
            "SELECT tool_id, full_doc FROM tools_search"
        ).fetchall()
        data = [
            {
                "sqlite_tool_id": r["tool_id"],
                "fullDoc": r["full_doc"],
                "embedding": None,
            }
            for r in rows
        ]
        with open(OUT_DIR / "tool_embeddings.json", "w") as f:
            json.dump(data, f)
        print(f"Exported {len(data)} tool docs (no embeddings — need regeneration)")
        return

    data = []
    for r in rows:
        emb_raw = r["embedding"]
        # sqlite-vec stores embeddings as raw bytes (float32)
        if isinstance(emb_raw, bytes):
            n_floats = len(emb_raw) // 4
            embedding = list(struct.unpack(f"{n_floats}f", emb_raw))
        elif isinstance(emb_raw, (list, tuple)):
            embedding = list(emb_raw)
        else:
            embedding = None

        data.append({
            "sqlite_tool_id": r["tool_id"],
            "fullDoc": r["full_doc"],
            "embedding": embedding,
        })

    with open(OUT_DIR / "tool_embeddings.json", "w") as f:
        json.dump(data, f)
    print(f"Exported {len(data)} tool embeddings")


def main():
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}")
        return

    conn = get_conn()

    export_servers(conn)
    export_server_packages(conn)
    export_server_remotes(conn)
    export_environment_variables(conn)
    export_tools(conn)
    export_tool_embeddings(conn)

    conn.close()
    print(f"\nAll data exported to {OUT_DIR}/")


if __name__ == "__main__":
    main()
