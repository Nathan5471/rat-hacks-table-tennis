"use client";

import { startTournament, deleteTournament } from "@/actions/tournamentActions";
import Link from "next/link";
import styles from "./adminpanel.module.css";

export default function UpcomingTournament({ tournament }) {
  return (
    <div className={styles.tournamentCard}>
      <h3 className={styles.tournamentName}>{tournament.name}</h3>
      <div className={styles.tournamentActions}>
        <Link
          href={`/adminpanel/edit/${tournament.id}`}
          className={`${styles.actionButton} ${styles.editButton}`}
        >
          Edit
        </Link>
        <button
          onClick={() => startTournament(tournament.id)}
          className={`${styles.actionButton} ${styles.startButton}`}
        >
          Start
        </button>
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
