ALTER TABLE "promo_codes" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "promo_codes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_price_cents" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_starts_at" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sale_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "promo_codes" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "promo_codes_code_idx" ON "promo_codes" USING btree ("code");