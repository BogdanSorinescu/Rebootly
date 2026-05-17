import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// pgTable declares a PostgreSQL table in TypeScript for queries and migrations.
// Docs: https://orm.drizzle.team/docs/sql-schema-declaration
export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
