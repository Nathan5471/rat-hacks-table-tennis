CREATE TABLE `Admin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Admin_username_unique` ON `Admin` (`username`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Tournament` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`size` integer NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	CONSTRAINT "power_check" CHECK(("__new_Tournament"."size" & ("__new_Tournament"."size" - 1)) = 0 AND "__new_Tournament"."size" > 0),
	CONSTRAINT "status_check" CHECK("__new_Tournament"."status" IN ('upcoming', 'ongoing', 'completed'))
);
--> statement-breakpoint
INSERT INTO `__new_Tournament`("id", "size", "status") SELECT "id", "size", "status" FROM `Tournament`;--> statement-breakpoint
DROP TABLE `Tournament`;--> statement-breakpoint
ALTER TABLE `__new_Tournament` RENAME TO `Tournament`;--> statement-breakpoint
PRAGMA foreign_keys=ON;