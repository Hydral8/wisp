import asyncio
import logging
logging.basicConfig(level=logging.DEBUG)
from server import get_server_connection_info
import httpx
from mcp.client.streamable_http import streamable_http_client
from mcp import ClientSession

async def main():
    info = await get_server_connection_info("github")
    print(info)
    if not info:
        print("github info not found")
        return
        
    http_client = httpx.AsyncClient(headers=info.get("headers")) if info.get("headers") else None
    
    try:
        async with streamable_http_client(info["url"], http_client=http_client) as (read, write, _):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("Initialized!")
                result = await session.call_tool("search_repositories", {"query": "language:python"})
                print(result)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
