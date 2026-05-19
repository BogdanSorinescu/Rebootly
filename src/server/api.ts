import { createClerkClient } from "@clerk/backend";
import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "#/db/index";
import { products } from "#/db/schema";
import { env } from "#/env";

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(80).default("Unknown"),
  model: z.string().trim().min(1).max(80).default("Unknown"),
  description: z.string().trim().max(1000).optional(),
  condition: z
    .enum(["new", "like_new", "good", "fair", "poor"])
    .default("good"),
  status: z.enum(["draft", "active", "sold_out", "archived"]).default("draft"),
  priceCents: z.number().int().min(0).default(0),
  stockQuantity: z.number().int().min(0).default(0),
});

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Hono builds a fetch-compatible HTTP app; chaining routes preserves RPC types.
// Docs: https://hono.dev/docs/api/hono
export const api = new Hono()
  .basePath("/api")
  .get("/", (c) => c.json({ ok: true, message: "Hono API is running" }))
  .get("/health", (c) => c.json({ ok: true }))
  .get("/products", async (c) => {
    const rows = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });

    return c.json({ products: rows });
  })
  .post("/products", async (c) => {
    const parsed = createProductSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      return c.json(
        { error: "Invalid input", issues: parsed.error.issues },
        400,
      );
    }

    const [product] = await db.insert(products).values(parsed.data).returning();

    return c.json({ product }, 201);
  })
  .get("/me", async (c) => {
    const authenticatedRequest = await clerkClient.authenticateRequest(
      c.req.raw,
    );

    if (!authenticatedRequest.isAuthenticated) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const auth = authenticatedRequest.toAuth();

    return c.json({ userId: auth.userId });
  })
  .notFound((c) => c.json({ error: "Not found" }, 404));

export type AppType = typeof api;
