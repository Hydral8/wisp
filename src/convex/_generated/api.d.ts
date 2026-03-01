/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as composio from "../composio.js";
import type * as credentials from "../credentials.js";
import type * as embeddings from "../embeddings.js";
import type * as execution from "../execution.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as marketplace from "../marketplace.js";
import type * as migrations_seedRegistry from "../migrations/seedRegistry.js";
import type * as planning from "../planning.js";
import type * as registry from "../registry.js";
import type * as users from "../users.js";
import type * as webhooks from "../webhooks.js";
import type * as workflows from "../workflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  composio: typeof composio;
  credentials: typeof credentials;
  embeddings: typeof embeddings;
  execution: typeof execution;
  helpers: typeof helpers;
  http: typeof http;
  marketplace: typeof marketplace;
  "migrations/seedRegistry": typeof migrations_seedRegistry;
  planning: typeof planning;
  registry: typeof registry;
  users: typeof users;
  webhooks: typeof webhooks;
  workflows: typeof workflows;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
