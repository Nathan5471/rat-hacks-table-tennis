import Link from "next/link";
import styles from "./sidebar.module.css";
import { logout } from "@/actions/authActions";
import SideBarLink from "./SideBarLink";
import { getDbAsync } from "@/lib/drizzle";
import { authenticated } from "@/controllers/auth";

export default async function SideBar() {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return <>Error</>;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  return (
    <div className={styles.container}>
      <div>
        <h1>{user.username}</h1>
        <p>{user.rating ? user.rating + "TP" : "Not Rated Yet"}</p>
        <br />
        <div className={styles.links}>
          <SideBarLink href="/home">Home</SideBarLink>
          <SideBarLink href="/tournaments">Tournaments</SideBarLink>
        </div>
      </div>
      <div></div>
      <div>
        <button onClick={logout} className={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
