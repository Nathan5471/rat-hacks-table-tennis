import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";

export default async function Home() {
  const db = await getDbAsync();
  const username = await authenticated();

  if (!username) {
    return <div>Error</div>;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  return <>Rating: {user.rating ? user.rating : "Not Rated Yet"}</>;
}
