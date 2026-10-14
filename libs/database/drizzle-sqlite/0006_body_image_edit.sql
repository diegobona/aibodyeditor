CREATE TABLE `body_image_edit` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`request_id` text NOT NULL,
	`input_hash` text NOT NULL,
	`mode` text NOT NULL,
	`intensity` text NOT NULL,
	`model` text NOT NULL,
	`status` text DEFAULT 'processing' NOT NULL,
	`cost_credits` integer NOT NULL,
	`result_key` text,
	`result_mime_type` text,
	`error_code` text,
	`refunded` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deadline_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "body_image_edit_status_check" CHECK("body_image_edit"."status" IN ('processing', 'succeeded', 'failed')),
	CONSTRAINT "body_image_edit_cost_check" CHECK("body_image_edit"."cost_credits" > 0)
);

--> statement-breakpoint
CREATE UNIQUE INDEX `body_image_edit_user_request_idx` ON `body_image_edit` (`user_id`,`request_id`);
