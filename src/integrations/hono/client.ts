import { hc } from "hono/client";

import type { AppType } from "#/server/api";

// hc builds a type-safe RPC client from the server's Hono route type.
// Docs: https://hono.dev/docs/guides/rpc
export const apiClient = hc<AppType>("/");
