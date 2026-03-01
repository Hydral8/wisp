import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback endpoint for Composio.
 * Composio redirects here after the user completes OAuth.
 * We show a small HTML page that posts a message to the opener window,
 * so the frontend can reactively update the connection status.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const connectedAccountId = searchParams.get("connected_account_id") || "";
  const status = searchParams.get("status") || "active";

  // Return an HTML page that sends a postMessage to the opener and closes itself
  const html = `<!DOCTYPE html>
<html>
<head><title>Connecting...</title></head>
<body>
<p>Connection successful! This window will close automatically.</p>
<script>
  if (window.opener) {
    window.opener.postMessage({
      type: "composio_callback",
      connectedAccountId: ${JSON.stringify(connectedAccountId)},
      status: ${JSON.stringify(status)}
    }, "*");
  }
  setTimeout(() => window.close(), 1500);
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
