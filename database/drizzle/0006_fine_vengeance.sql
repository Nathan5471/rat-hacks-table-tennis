PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tournament_users` (
	`user_id` integer NOT NULL,
	`tournament_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `tournament_id`),
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tournament_id`) REFERENCES `Tournament`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tournament_users`("user_id", "tournament_id") SELECT "user_id", "tournament_id" FROM `tournament_users`;--> statement-breakpoint
DROP TABLE `tournament_users`;--> statement-breakpoint
ALTER TABLE `__new_tournament_users` RENAME TO `tournament_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;