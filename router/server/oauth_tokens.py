#!/usr/bin/env python3
"""
OAuth/token helpers for MCP connectors.

Focus:
- Google OAuth refresh flow for Gmail-related connectors.
"""

from __future__ import annotations

import os
from typing import Dict, Optional

import requests


GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


def refresh_google_access_token(env: Dict[str, str], timeout_seconds: int = 15) -> Optional[str]:
    """
    Refresh Google OAuth access token using refresh_token grant.

    Required:
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - GOOGLE_REFRESH_TOKEN
    """
    client_id = env.get("GOOGLE_CLIENT_ID", "").strip()
    client_secret = env.get("GOOGLE_CLIENT_SECRET", "").strip()
    refresh_token = env.get("GOOGLE_REFRESH_TOKEN", "").strip()

    if not (client_id and client_secret and refresh_token):
        return None

    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }
    resp = requests.post(GOOGLE_TOKEN_URL, data=payload, timeout=timeout_seconds)
    resp.raise_for_status()
    data = resp.json()
    token = data.get("access_token")
    if not token:
        raise RuntimeError("Google token response missing access_token")
    return token


def maybe_prepare_oauth_env(server_name: str, env: Dict[str, str]) -> Dict[str, str]:
    """
    Prepare env for OAuth-backed connectors.

    Behavior:
    - For Gmail connectors, auto-refresh GOOGLE_ACCESS_TOKEN if refresh creds are present.
    """
    merged = dict(env)

    is_gmail_connector = "gmail" in server_name.lower()
    if is_gmail_connector:
        try:
            token = refresh_google_access_token(merged)
            if token:
                merged["GOOGLE_ACCESS_TOKEN"] = token
        except Exception:
            # Keep original env when refresh fails; downstream preflight/error handling
            # will surface a clear failure reason.
            pass

    return merged

