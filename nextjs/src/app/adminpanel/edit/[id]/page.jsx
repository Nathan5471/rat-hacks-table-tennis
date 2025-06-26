import { getDbAsync } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { tournaments, tournamentUsers, users } from "database/schema";
import EditClient from "./EditClient.jsx";

export default async function Edit({ params }) {
  const { id } = await params;
  const db = await getDbAsync();

  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, id),
    with: {
      users: {
        with: {
          user: true,
        },
      },
    },
  });

  return (
    <EditClient
      name={tournament.name}
      size={tournament.size}
      users={tournament.users}
      id={id}
    />
  );
}
