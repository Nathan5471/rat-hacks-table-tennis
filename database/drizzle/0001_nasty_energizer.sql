ALTER TABLE `User` RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE `User` RENAME COLUMN "passwordSalt" TO "password_salt";--> statement-breakpoint
CREATE TABLE `tournament_users` (
	`user_id` integer NOT NULL,
	`tournament_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `tournament_id`),
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tournament_id`) REFERENCES `Tournament`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Tournament` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`size` integer NOT NULL,
	CONSTRAINT "power_check" CHECK(("Tournament"."size" & ("Tournament"."size" - 1)) = 0 AND "Tournament"."size" > 0)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_match_users` (
	`user_id` integer NOT NULL,
	`match_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `match_id`),
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_id`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_match_users`("user_id", "match_id") SELECT "user_id", "match_id" FROM `match_users`;--> statement-breakpoint
DROP TABLE `match_users`;--> statement-breakpoint
ALTER TABLE `__new_match_users` RENAME TO `match_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `Match` ADD `tournament_id` integer NOT NULL REFERENCES Tournament(id);