import { logout } from "@/actions/authActions";
import { startTournament } from "@/actions/tournamentActions";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments } from "@/lib/schema";
import Link from "next/link";
import { TournamentItem } from "./TournamentItem";

export default async function AdminPanel() {
  const db = await getDbAsync();
  const allTournaments = await db.query.tournaments.findMany({
    with: {
      users: {
        user: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
    },
  });
  return (
    <>
      Admin Panel{" "}
      <form action={logout}>
        <button>Logout</button>
      </form>
      <Link href="/adminpanel/create">Create</Link>
      {allTournaments.map((t) => (
        <TournamentItem key={t.id} tournament={t} />
      ))}
    </>
  );
}
