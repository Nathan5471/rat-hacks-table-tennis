"use client";

import { startTournament, deleteTournament } from "@/actions/tournamentActions";
import Link from "next/link";

export default function UpcomingTournament({ tournament }) {
  return (
    <div>
      {tournament.name}{" "}
      <Link href={`/adminpanel/live/${tournament.id}`}>Live</Link>{" "}
      <button onClick={() => deleteTournament(tournament.id)}>Delete</button>
    </div>
  );
}
