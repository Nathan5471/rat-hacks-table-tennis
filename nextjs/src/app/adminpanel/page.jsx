import { logout } from "@/actions/authActions";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments } from "@/lib/schema";
import Link from "next/link";

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
        <div key={t.id}>
          {t.name} <Link href={`/adminpanel/edit/${t.id}`}>Edit</Link>
        </div>
      ))}
    </>
  );
}
