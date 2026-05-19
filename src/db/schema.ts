import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// pgTable declares a PostgreSQL table in TypeScript for queries and migrations.
// Docs: https://orm.drizzle.team/docs/sql-schema-declaration
export const productCondition = pgEnum("product_condition", [
  "new",
  "like_new",
  "good",
  "fair",
  "poor",
]);

export const productStatus = pgEnum("product_status", [
  "draft",
  "active",
  "sold_out",
  "archived",
]);

export const products = pgTable("products", {
  id: serial().primaryKey(),

  name: text().notNull(),
  brand: text().notNull(),
  model: text().notNull(),
  description: text(),

  condition: productCondition().notNull(),
  status: productStatus().notNull().default("draft"),

  priceCents: integer("price_cents").notNull(),
  salePriceCents: integer("sale_price_cents"),
  saleStartsAt: timestamp("sale_starts_at"),
  saleEndsAt: timestamp("sale_ends_at"),

  stockQuantity: integer("stock_quantity").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discountType = pgEnum("discount_type", [
  "percent",
  "fixed_amount",
]);

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: serial().primaryKey(),
    code: text().notNull(),
    discountValue: integer("discount_value").notNull(),
    discountType: discountType("discount_type").notNull(),

    startsAt: timestamp("starts_at"),
    expiresAt: timestamp("expires_at"),

    usageLimit: integer("usage_limit"),
    timesUsed: integer("times_used").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [uniqueIndex("promo_codes_code_idx").on(table.code)],
);
