import { getDbAsync } from "@/lib/drizzle";
import { tournaments, users } from "@/lib/schema";
import TournamentsList from "./TournamentsList";
import { authenticated } from "@/controllers/auth";
import { eq } from "drizzle-orm";

export default async function Tournaments() {
  const db = await getDbAsync();

  const username = await authenticated();

  const allTournaments = await db.select().from(tournaments);

  const userWithTournaments = await db.query.users.findFirst({
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
