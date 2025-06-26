import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  check,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  rating: integer("rating"),
});

export const userRelations = relations(users, ({ many }) => ({
  tournaments: many(tournamentUsers),
  matches: many(matches),
}));

export const admins = sqliteTable("Admin", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
});

export const matches = sqliteTable("Match", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  player1Id: integer("player_1")
    .notNull()
    .references(() => users.id),
  player2Id: integer("player_2")
    .notNull()
    .references(() => users.id),
  player1Score: integer("player_1_score").notNull(),
  player2Score: integer("player_2_score").notNull(),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id),
});

export const matchRelations = relations(matches, ({ one }) => ({
  player1: one(users),
  player2: one(users),
  tournament: one(tournaments),
}));

export const tournaments = sqliteTable(
  "Tournament",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    size: integer("size").notNull(),
    status: text("status").notNull().default("upcoming"),
  },
  (table) => [
    check(
      "power_check",
      sql`(${table.size} & (${table.size} - 1)) = 0 AND ${table.size} > 0`
    ),
    check(
      "status_check",
      sql`${table.status} IN ('upcoming', 'ongoing', 'completed')`
    ),
    /*  
      the check is to make sure the size is a power of two
      if a tournament is made that doesn't have a 2^x number of
      players then there will be uneven matchmaking
    */
  ]
);

export const tournamentRelations = relations(tournaments, ({ many }) => ({
  matches: many(matches),
  users: many(tournamentUsers),
}));

export const tournamentUsers = sqliteTable(
  "tournament_users",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    tournamentId: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    standing: integer("standing"),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tournamentId] })]
);

export const tournamentUsersRelations = relations(
  tournamentUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [tournamentUsers.userId],
      references: [users.id],
    }),
    tournament: one(tournaments, {
      fields: [tournamentUsers.tournamentId],
      references: [tournaments.id],
    }),
  })
);
