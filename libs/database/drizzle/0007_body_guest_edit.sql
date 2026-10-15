CREATE TABLE "body_guest_edit" (
	"id" text PRIMARY KEY NOT NULL,
	"guest_id" text NOT NULL,
	"network_hash" text NOT NULL,
	"request_id" text NOT NULL,
	"input_hash" text NOT NULL,
	"mode" text NOT NULL,
	"intensity" text NOT NULL,
	"model" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"cost_credits" integer DEFAULT 0 NOT NULL,
	"result_key" text,
	"result_mime_type" text,
	"error_code" text,
	"refunded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	CONSTRAINT "body_guest_edit_status_check" CHECK ("body_guest_edit"."status" IN ('processing', 'succeeded', 'failed')),
	CONSTRAINT "body_guest_edit_cost_check" CHECK ("body_guest_edit"."cost_credits" = 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "body_guest_edit_request_idx" ON "body_guest_edit" USING btree ("guest_id","request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "body_guest_edit_allowance_idx" ON "body_guest_edit" USING btree ("guest_id") WHERE "body_guest_edit"."status" IN ('processing', 'succeeded');--> statement-breakpoint
CREATE INDEX "body_guest_edit_network_time_idx" ON "body_guest_edit" USING btree ("network_hash","created_at");