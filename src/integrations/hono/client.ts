import { hc } from "hono/client";

import type { AppType } from "#/server/api";

export const apiClient = hc<AppType>("/");
