import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "#/env";

import * as schema from "./schema.ts";

// drizzle creates the typed PostgreSQL client from the connection URL and schema.
// Docs: https://orm.drizzle.team/docs/get-started-postgresql
export const db = drizzle(env.DATABASE_URL, { schema });
