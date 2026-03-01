#!/usr/bin/env node
/**
 * Backfill real embedding vectors from SQLite into Convex.
 *
 * 1. Reads tools.json (sqlite_id → serverName+toolName)
 * 2. Queries Convex for all tools (serverName+toolName → convex tool _id)
 * 3. Reads tool_embeddings.json (sqlite_tool_id → fullDoc)
 * 4. Reads tool_embeddings_vectors.json (sqlite_tool_id → 768D vector)
 * 5. Clears existing zero-vector embeddings
 * 6. Re-inserts with real vectors
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

async function main() {
  console.log(`Connecting to Convex at ${convexUrl}\n`);

  // 1. Load tools.json to build sqlite_id → serverName+toolName map
  console.log("1. Loading tools.json...");
  const tools = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "tools.json"), "utf8")
  );
  const sqliteIdToKey = new Map();
  for (const t of tools) {
    sqliteIdToKey.set(t.sqlite_id, `${t.serverName}::${t.toolName}`);
  }
  console.log(`   ${sqliteIdToKey.size} sqlite tool IDs mapped`);

  // 2. Query Convex for all tools → build serverName+toolName → convex_id map
  console.log("2. Querying Convex tools...");
  const convexTools = await callMutation(
    "migrations/seedRegistry:listAllTools",
    {}
  );
  const keyToConvexId = new Map();
  for (const t of convexTools) {
    keyToConvexId.set(`${t.serverName}::${t.toolName}`, t.id);
  }
  console.log(`   ${keyToConvexId.size} Convex tools found`);

  // 3. Load tool_embeddings.json for fullDoc
  console.log("3. Loading tool_embeddings.json...");
  const embDocs = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "tool_embeddings.json"), "utf8")
  );
  const sqliteIdToDoc = new Map();
  for (const e of embDocs) {
    sqliteIdToDoc.set(e.sqlite_tool_id, e.fullDoc || "");
  }
  console.log(`   ${sqliteIdToDoc.size} docs loaded`);

  // 4. Load real vectors
  console.log("4. Loading tool_embeddings_vectors.json...");
  const vectors = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "tool_embeddings_vectors.json"), "utf8")
  );
  const vectorCount = Object.keys(vectors).length;
  console.log(`   ${vectorCount} real vectors loaded`);

  // 5. Build the full mapping: sqlite_id → key → convex_id + vector + doc
  console.log("5. Building embedding records...");
  const records = [];
  let matched = 0;
  let noKey = 0;
  let noConvex = 0;
  let noVec = 0;

  for (const [sqliteIdStr, vector] of Object.entries(vectors)) {
    const sqliteId = parseInt(sqliteIdStr);
    const key = sqliteIdToKey.get(sqliteId);
    if (!key) {
      noKey++;
      continue;
    }
    const convexToolId = keyToConvexId.get(key);
    if (!convexToolId) {
      noConvex++;
      continue;
    }
    const fullDoc = sqliteIdToDoc.get(sqliteId) || "";
    records.push({
      toolId: convexToolId,
      fullDoc,
      embedding: vector,
    });
    matched++;
  }
  console.log(`   ${matched} matched, ${noKey} no key, ${noConvex} no convex tool, ${noVec} no vector`);

  // 6. Clear existing zero-vector embeddings (paginated)
  console.log("\n6. Clearing existing zero-vector embeddings...");
  let totalCleared = 0;
  while (true) {
    const cleared = await callMutation(
      "migrations/seedRegistry:clearToolEmbeddings",
      { batchSize: 100 }
    );
    totalCleared += cleared;
    if (cleared === 0) break;
    process.stdout.write(`\r   Cleared ${totalCleared} records...`);
  }
  console.log(`\r   Cleared ${totalCleared} records total`);

  // 7. Re-insert with real vectors
  console.log("\n7. Inserting embeddings with real vectors...");
  const batchSize = 10; // Small batches — each embedding is ~6KB
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await callMutation("migrations/seedRegistry:seedToolEmbeddings", {
      embeddings: batch,
    });
    process.stdout.write(
      `\r   Progress: ${Math.min(i + batchSize, records.length)}/${records.length}`
    );
  }
  console.log(" Done!");

  console.log(`\nBackfill complete! ${records.length} embeddings with real vectors.`);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
