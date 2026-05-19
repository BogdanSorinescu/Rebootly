CREATE TYPE "public"."discount_type" AS ENUM('percent', 'fixed_amount');--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_value" integer NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"starts_at" timestamp,
	"expires_at" timestamp,
	"usage_limit" integer,
	"times_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
