CREATE TABLE "body_image_edit" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"request_id" text NOT NULL,
	"input_hash" text NOT NULL,
	"mode" text NOT NULL,
	"intensity" text NOT NULL,
	"model" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"cost_credits" integer NOT NULL,
	"result_key" text,
	"result_mime_type" text,
	"error_code" text,
	"refunded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	CONSTRAINT "body_image_edit_status_check" CHECK ("body_image_edit"."status" IN ('processing', 'succeeded', 'failed')),
	CONSTRAINT "body_image_edit_cost_check" CHECK ("body_image_edit"."cost_credits" > 0)
);

--> statement-breakpoint
ALTER TABLE "body_image_edit" ADD CONSTRAINT "body_image_edit_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "body_image_edit_user_request_idx" ON "body_image_edit" USING btree ("user_id","request_id");
