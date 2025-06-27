"use client";

import { deleteTournament } from "@/actions/tournamentActions";
import Link from "next/link";
import styles from "./adminpanel.module.css";

export default function OngoingTournament({ tournament }) {
  return (
    <div className={styles.tournamentCard}>
      <h3 className={styles.tournamentName}>{tournament.name}</h3>
      <div className={styles.tournamentActions}>
        <Link
          href={`/adminpanel/live/${tournament.id}`}
          className={`${styles.actionButton} ${styles.liveButton}`}
        >
          Live
        </Link>
        <button
          onClick={() => deleteTournament(tournament.id)}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
