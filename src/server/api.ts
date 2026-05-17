import { createClerkClient } from "@clerk/backend";
import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "#/db/index";
import { products } from "#/db/schema";

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

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

    const [product] = await db
      .insert(products)
      .values({ name: parsed.data.name })
      .returning();

    return c.json({ product }, 201);
  })
  .get("/me", async (c) => {
    if (!process.env.CLERK_SECRET_KEY) {
      return c.json({ error: "CLERK_SECRET_KEY is not configured" }, 500);
    }

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
