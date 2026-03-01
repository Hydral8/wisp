#!/usr/bin/env node
/**
 * Import exported MCP registry data into Convex.
 *
 * Usage:
 *   node scripts/import_to_convex.mjs
 *
 * Reads JSON files from scripts/data/ and calls Convex mutations
 * to seed the registry tables via the HTTP API.
 *
 * Requires CONVEX_URL env var or reads from src/.env.local
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

// Read Convex URL
let convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!convexUrl) {
  try {
    const envLocal = fs.readFileSync(
      path.join(__dirname, "..", "src", ".env.local"),
      "utf8"
    );
    const match = envLocal.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/);
    if (match) convexUrl = match[1].trim();
  } catch {}
}
if (!convexUrl) {
  console.error("Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL");
  process.exit(1);
}

console.log(`Connecting to Convex at ${convexUrl}`);

/**
 * Call a Convex mutation via the HTTP API.
 */
async function callMutation(fnPath, args) {
  const url = `${convexUrl}/api/mutation`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: fnPath, args, format: "json" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mutation ${fnPath} failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  if (json.status === "error") {
    throw new Error(`Mutation ${fnPath} error: ${json.errorMessage}`);
  }
  return json.value;
}

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping ${filename} (not found)`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function batchCall(fnPath, dataKey, items, batchSize = 50) {
  console.log(`  Importing ${items.length} items in batches of ${batchSize}...`);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await callMutation(fnPath, { [dataKey]: batch });
    process.stdout.write(
      `\r  Progress: ${Math.min(i + batchSize, items.length)}/${items.length}`
    );
  }
  console.log(" Done");
}

async function main() {
  // 1. Servers (remap snake_case → camelCase)
  console.log("\n1. Importing servers...");
  const rawServers = readJson("servers.json");
  if (rawServers) {
    const servers = rawServers.map((s) => ({
      name: s.name,
      description: s.description,
      version: s.version || "",
      repositoryUrl: s.repository_url || s.repositoryUrl || "",
      status: s.status || "active",
    }));
    await batchCall("migrations/seedRegistry:seedServers", "servers", servers, 50);
  }

  // 2. Server packages
  console.log("\n2. Importing server packages...");
  const packages = readJson("server_packages.json");
  if (packages) {
    await batchCall(
      "migrations/seedRegistry:seedServerPackages",
      "packages",
      packages,
      50
    );
  }

  // 3. Server remotes
  console.log("\n3. Importing server remotes...");
  const remotes = readJson("server_remotes.json");
  if (remotes) {
    await batchCall(
      "migrations/seedRegistry:seedServerRemotes",
      "remotes",
      remotes,
      50
    );
  }

  // 4. Environment variables
  console.log("\n4. Importing environment variables...");
  const envVars = readJson("environment_variables.json");
  if (envVars) {
    await batchCall(
      "migrations/seedRegistry:seedEnvironmentVariables",
      "vars",
      envVars,
      50
    );
  }

  // 5. Tools (need to track IDs for embedding association)
  console.log("\n5. Importing tools...");
  const tools = readJson("tools.json");
  if (tools) {
    // Map sqlite_id -> convex_id for embedding linkage
    const sqliteToConvex = new Map();
    const batchSize = 50;

    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize);
      const convexBatch = batch.map((t) => ({
        serverName: t.serverName,
        toolName: t.toolName,
        title: t.title,
        description: t.description,
        inputSchema: t.inputSchema,
      }));

      const ids = await callMutation(
        "migrations/seedRegistry:seedTools",
        { tools: convexBatch }
      );

      // Map sqlite IDs to convex IDs
      batch.forEach((t, j) => {
        if (ids && ids[j]) {
          sqliteToConvex.set(t.sqlite_id, ids[j]);
        }
      });

      process.stdout.write(
        `\r  Progress: ${Math.min(i + batchSize, tools.length)}/${tools.length}`
      );
    }
    console.log(" Done");

    // 6. Tool embeddings (docs only — embeddings need regeneration)
    console.log("\n6. Importing tool docs (embeddings will be regenerated)...");
    const embeddings = readJson("tool_embeddings.json");
    if (embeddings) {
      const docsWithIds = embeddings
        .map((e) => {
          const toolId = sqliteToConvex.get(e.sqlite_tool_id);
          if (!toolId) return null;
          return {
            toolId,
            fullDoc: e.fullDoc || "",
            // Use the exported embedding if available, otherwise a zero vector
            embedding: e.embedding || new Array(768).fill(0),
          };
        })
        .filter(Boolean);

      console.log(
        `  ${docsWithIds.length} docs matched to Convex tool IDs (of ${embeddings.length} total)`
      );

      const embBatchSize = 25; // Smaller batches for embeddings (large payloads)
      for (let i = 0; i < docsWithIds.length; i += embBatchSize) {
        const batch = docsWithIds.slice(i, i + embBatchSize);
        await callMutation(
          "migrations/seedRegistry:seedToolEmbeddings",
          { embeddings: batch }
        );
        process.stdout.write(
          `\r  Progress: ${Math.min(i + embBatchSize, docsWithIds.length)}/${docsWithIds.length}`
        );
      }
      console.log(" Done");
    }
  }

  // 7. Credential profiles (if they exist)
  console.log("\n7. Checking for credential profiles...");
  const credPath = path.join(
    __dirname,
    "..",
    "server",
    "credentials_profiles.json"
  );
  if (fs.existsSync(credPath)) {
    console.log(
      "  Found credentials_profiles.json — these need to be imported after you sign in."
    );
    console.log(
      "  (Credentials are user-scoped in Convex, so they need a userId.)"
    );
    console.log(
      "  Run the app, sign in, then use the Credentials pane to re-add them."
    );
  } else {
    console.log("  No credential profiles found, skipping.");
  }

  console.log("\nMigration complete!");
  console.log(
    "\nNote: Tool embeddings were exported as zero vectors since sqlite-vec"
  );
  console.log(
    "couldn't be loaded. You'll need to regenerate them using HuggingFace."
  );
  console.log(
    "Run a regeneration script or they'll be generated on first search."
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
