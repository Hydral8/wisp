#!/usr/bin/env python3
"""
OAuth setup/preflight utility for key MCP connectors.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from oauth_tokens import refresh_google_access_token


ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)


CHECKS = {
    "gmail_stdio": ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    "gmail_remote": ["GOOGLE_ACCESS_TOKEN"],
    "notion_remote": ["NOTION_ACCESS_TOKEN|NOTION_API_KEY"],
    "slack_remote": ["SLACK_BOT_TOKEN|SLACK_USER_TOKEN"],
}


def has_any(env_names: str) -> bool:
    if "|" not in env_names:
        return bool(os.environ.get(env_names, "").strip())
    return any(bool(os.environ.get(k, "").strip()) for k in env_names.split("|"))


def cmd_check() -> int:
    print("OAuth preflight:")
    failed = 0
    for name, reqs in CHECKS.items():
        missing = [r for r in reqs if not has_any(r)]
        if missing:
            failed += 1
            print(f"  ✗ {name}: missing {', '.join(missing)}")
        else:
            print(f"  ✓ {name}")
    return 1 if failed else 0


def cmd_google_token() -> int:
    env = dict(os.environ)
    try:
        token = refresh_google_access_token(env)
    except Exception as exc:  # noqa: BLE001
        print(f"✗ failed to refresh Google token: {exc}")
        return 1
    if not token:
        print("✗ failed: missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REFRESH_TOKEN")
        return 1
    print("✓ google access token refreshed")
    print(f"export GOOGLE_ACCESS_TOKEN='{token}'")
    return 0


def cmd_example_mapping() -> int:
    example = {
        "com.mintmcp/gmail": {
            "provider_config_key": "google-mail",
            "connection_id": "default",
        },
        "com.notion/mcp": {
            "provider_config_key": "notion",
            "connection_id": "workspace_prod",
        },
        "ai.smithery/smithery-ai-slack": {
            "provider_config_key": "slack",
            "connection_id": "team_main",
        },
    }
    print(json.dumps(example, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="OAuth setup for MCP connectors")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check", help="Validate required OAuth env vars")
    sub.add_parser("google-token", help="Refresh Google access token via refresh token")
    sub.add_parser("mapping-example", help="Print sample NANGO_MCP_CONNECTIONS_JSON")
    args = parser.parse_args()

    if args.cmd == "check":
        return cmd_check()
    if args.cmd == "google-token":
        return cmd_google_token()
    if args.cmd == "mapping-example":
        return cmd_example_mapping()
    return 1


if __name__ == "__main__":
    sys.exit(main())
