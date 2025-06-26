DROP TABLE `match_users`;--> statement-breakpoint
ALTER TABLE `Match` ADD `player_1` integer NOT NULL REFERENCES User(id);--> statement-breakpoint
ALTER TABLE `Match` ADD `player_2` integer NOT NULL REFERENCES User(id);--> statement-breakpoint
ALTER TABLE `Match` ADD `player_1_score` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `Match` ADD `player_2_score` integer NOT NULL;