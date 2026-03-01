#!/usr/bin/env python3
"""
Nango auth helpers for MCP connectors.

This module fetches access tokens from Nango based on server-name mappings so
Wisp can call OAuth-protected remote MCP servers without hardcoding tokens.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

import httpx


def _load_connection_map() -> Dict[str, Dict[str, str]]:
    """
    Load server -> Nango connection mapping from environment JSON.

    Expected format (NANGO_MCP_CONNECTIONS_JSON):
    {
      "com.notion/mcp": {
        "provider_config_key": "notion",
        "connection_id": "workspace_prod"
      },
      "com.mintmcp/gmail": {
        "provider_config_key": "google-mail",
        "connection_id": "default"
      }
    }
    """
    raw = os.environ.get("NANGO_MCP_CONNECTIONS_JSON", "").strip()
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        return {}


def _extract_access_token(payload: Any) -> Optional[str]:
    """Recursively search a JSON payload for an access token field."""
    if isinstance(payload, dict):
        for key in ("access_token", "accessToken", "token"):
            value = payload.get(key)
            if isinstance(value, str) and value:
                return value
        for value in payload.values():
            token = _extract_access_token(value)
            if token:
                return token
    elif isinstance(payload, list):
        for item in payload:
            token = _extract_access_token(item)
            if token:
                return token
    return None


async def fetch_nango_access_token(
    provider_config_key: str,
    connection_id: str,
    timeout_seconds: int = 15,
) -> str:
    """
    Fetch access token from Nango for a provider + connection.

    Required env vars:
    - NANGO_BASE_URL (e.g. https://api.nango.dev)
    - NANGO_SECRET_KEY
    """
    base_url = os.environ.get("NANGO_BASE_URL", "").strip().rstrip("/")
    secret_key = os.environ.get("NANGO_SECRET_KEY", "").strip()
    if not base_url:
        raise RuntimeError("Missing NANGO_BASE_URL")
    if not secret_key:
        raise RuntimeError("Missing NANGO_SECRET_KEY")

    headers = {"Authorization": f"Bearer {secret_key}"}
    params = {"provider_config_key": provider_config_key}
    candidate_urls = [
        f"{base_url}/connection/{connection_id}",
        f"{base_url}/connections/{connection_id}",
    ]

    last_error = "unknown_nango_error"
    async with httpx.AsyncClient(timeout=timeout_seconds) as client:
        for url in candidate_urls:
            try:
                response = await client.get(url, headers=headers, params=params)
                if response.status_code == 404:
                    last_error = f"404_not_found:{url}"
                    continue
                response.raise_for_status()
                payload = response.json()
                token = _extract_access_token(payload)
                if token:
                    return token
                last_error = "access_token_not_found_in_nango_response"
            except Exception as exc:  # noqa: BLE001
                last_error = str(exc)

    raise RuntimeError(f"Unable to fetch token from Nango: {last_error}")


async def maybe_inject_nango_auth_headers(
    server_name: str,
    headers: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Inject Bearer auth header from Nango for mapped servers.

    If server is not mapped in NANGO_MCP_CONNECTIONS_JSON, headers pass through.
    """
    merged_headers: Dict[str, Any] = dict(headers or {})
    # Direct env-token fallback (self-managed OAuth) before broker-based mapping.
    if "Authorization" not in merged_headers:
        direct_env_by_server = {
            "com.notion/mcp": ["NOTION_ACCESS_TOKEN", "NOTION_API_KEY"],
            "com.mintmcp/gmail": ["GOOGLE_ACCESS_TOKEN"],
            "ai.smithery/smithery-ai-slack": ["SLACK_BOT_TOKEN", "SLACK_USER_TOKEN"],
            "com.stripe/mcp": ["STRIPE_SECRET_KEY", "STRIPE_API_KEY"],
            "com.atlassian/atlassian-mcp-server": ["ATLASSIAN_ACCESS_TOKEN"],
            "app.linear/linear": ["LINEAR_ACCESS_TOKEN", "LINEAR_API_KEY"],
        }
        for env_name in direct_env_by_server.get(server_name, []):
            token = os.environ.get(env_name, "").strip()
            if token:
                merged_headers["Authorization"] = f"Bearer {token}"
                break

    connection_map = _load_connection_map()
    cfg = connection_map.get(server_name)
    if not cfg:
        return merged_headers

    provider_config_key = cfg.get("provider_config_key", "").strip()
    connection_id = cfg.get("connection_id", "").strip()
    if not provider_config_key or not connection_id:
        raise RuntimeError(
            f"Nango mapping for '{server_name}' missing provider_config_key or connection_id"
        )

    token = await fetch_nango_access_token(provider_config_key, connection_id)
    # Nango token takes precedence if configured.
    merged_headers["Authorization"] = f"Bearer {token}"
    return merged_headers
