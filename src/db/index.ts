import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.ts";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to use Drizzle");
}

// drizzle creates the typed PostgreSQL client from the connection URL and schema.
// Docs: https://orm.drizzle.team/docs/get-started-postgresql
export const db = drizzle(databaseUrl, { schema });
