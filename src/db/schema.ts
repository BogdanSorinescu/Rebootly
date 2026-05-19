import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

// pgTable declares a PostgreSQL table in TypeScript for queries and migrations.
// Docs: https://orm.drizzle.team/docs/sql-schema-declaration
export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  price: integer().notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  userId: text("user_id").notNull(),
  productId: integer("product_id").references(() => products.id),
  amount: integer().notNull(),
  status: text().default('paid').notNull(), // 'paid', 'refunded'
  createdAt: timestamp("created_at").defaultNow(),
  refundedAt: timestamp("refunded_at"),
});
