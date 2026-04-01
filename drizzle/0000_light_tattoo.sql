CREATE TABLE `partners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_ar` text NOT NULL,
	`logo_url` text,
	`category` text NOT NULL,
	`category_ar` text NOT NULL,
	`description` text,
	`description_ar` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `submission_partners` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`partner_id` text NOT NULL,
	`interest_type` text NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_name` text NOT NULL,
	`merchant_email` text NOT NULL,
	`merchant_phone` text,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL
);
