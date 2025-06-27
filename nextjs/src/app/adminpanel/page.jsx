import { logout } from "@/actions/authActions";
import { startTournament } from "@/actions/tournamentActions";
import { getDbAsync } from "@/lib/drizzle";
import { tournaments } from "database/schema";
import Link from "next/link";
import UpcomingTournament from "./UpcomingTournament";
import OngoingTournament from "./OngoingTournament";
import { Fragment } from "react";
import styles from "./adminpanel.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <div className={styles.headerActions}>
          <Link href="/adminpanel/create" className={styles.createLink}>
            Create Tournament
          </Link>
          <form action={logout} className={styles.logoutForm}>
            <button className={styles.logoutButton}>Logout</button>
          </form>
        </div>
      </div>

      <div className={styles.tournamentsSection}>
        <div className={styles.tournamentsList}>
          {allTournaments.map((t) => (
            <Fragment key={t.id}>
              {t.status == "upcoming" && <UpcomingTournament tournament={t} />}
              {t.status == "ongoing" && <OngoingTournament tournament={t} />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
