import { getDbAsync } from "@/lib/drizzle";
import { tournaments, users } from "database/schema";
import TournamentsList from "./TournamentsList";
import { authenticated } from "@/controllers/auth";
import { eq } from "drizzle-orm";

export default async function Tournaments() {
  const db = await getDbAsync();

  const username = await authenticated();

  const allTournaments = await db.query.tournaments.findMany({
    with: {
      users: {
        columns: {
          standing: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  const userWithTournaments = await db.query.users.findFirst({
    columns: {
      id: true,
      username: true,
      rating: true,
    },
    where: eq(users.username, username),
    with: {
      tournaments: {
        with: {
          tournament: true,
        },
      },
    },
  });

  const myTournaments =
    userWithTournaments?.tournaments.map((t) => t.tournament) || [];

  return (
    <TournamentsList
      tournaments={allTournaments}
      myTournaments={myTournaments}
    />
  );
}
