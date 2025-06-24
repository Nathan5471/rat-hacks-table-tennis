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
});

export const userRelations = relations(users, ({ many }) => ({
  matches: many(matchUsers),
}));

export const admins = sqliteTable("Admin", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
});

export const matches = sqliteTable("Match", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id),
});

export const matchRelations = relations(matches, ({ one, many }) => ({
  users: many(matchUsers),
  tournament: one(tournaments),
}));

export const matchUsers = sqliteTable(
  "match_users",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    matchId: integer("match_id")
      .notNull()
      .references(() => matches.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.matchId] })]
);

export const matchUsersRelations = relations(matchUsers, ({ one }) => ({
  user: one(users, {
    fields: [matchUsers.userId],
    references: [users.id],
  }),
  match: one(matches, {
    fields: [matchUsers.matchId],
    references: [matches.id],
  }),
}));

export const tournaments = sqliteTable(
  "Tournament",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
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
  users: many(users),
}));

export const tournamentUsers = sqliteTable(
  "tournament_users",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    tournamentId: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tournamentId] })]
);
