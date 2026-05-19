import {
  boolean,
  index,
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
  lowStockThreshold: integer("low_stock_threshold").notNull().default(0),

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

export const inventoryAdjustmentType = pgEnum("inventory_adjustment_type", [
  "manual",
  "restock",
  "sale",
  "return",
  "correction",
]);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial().primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text().notNull(),
    color: text(),
    storageGb: integer("storage_gb"),
    condition: productCondition().notNull(),
    priceCents: integer("price_cents").notNull(),
    salePriceCents: integer("sale_price_cents"),
    saleStartsAt: timestamp("sale_starts_at"),
    saleEndsAt: timestamp("sale_ends_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("product_variants_sku_idx").on(table.sku),
    index("product_variants_product_id_idx").on(table.productId),
  ],
);

export const inventoryManagement = pgTable(
  "inventory_management",
  {
    id: serial().primaryKey(),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantityChange: integer("quantity_change").notNull(),
    type: inventoryAdjustmentType("type").notNull(),
    note: text(),
    adjustedByUserId: text("adjusted_by_user_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("inventory_management_variant_id_idx").on(table.variantId)],
);

export const inventory = pgTable(
  "inventory",
  {
    id: serial().primaryKey(),

    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("inventory_variant_id_idx").on(table.variantId)],
);
