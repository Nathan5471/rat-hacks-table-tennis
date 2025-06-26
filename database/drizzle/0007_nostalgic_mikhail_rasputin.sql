PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Match` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_1` integer NOT NULL,
	`player_2` integer NOT NULL,
	`player_1_score` integer NOT NULL,
	`player_2_score` integer NOT NULL,
	`tournament_id` integer NOT NULL,
	FOREIGN KEY (`player_1`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`player_2`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tournament_id`) REFERENCES `Tournament`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Match`("id", "player_1", "player_2", "player_1_score", "player_2_score", "tournament_id") SELECT "id", "player_1", "player_2", "player_1_score", "player_2_score", "tournament_id" FROM `Match`;--> statement-breakpoint
DROP TABLE `Match`;--> statement-breakpoint
ALTER TABLE `__new_Match` RENAME TO `Match`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `tournament_users` ADD `standing` integer;