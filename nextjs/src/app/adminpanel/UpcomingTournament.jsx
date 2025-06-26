"use client";

import { startTournament, deleteTournament } from "@/actions/tournamentActions";
import Link from "next/link";

export default function UpcomingTournament({ tournament }) {
  return (
    <div>
      {tournament.name}{" "}
      <Link href={`/adminpanel/edit/${tournament.id}`}>Edit</Link>{" "}
      <button onClick={() => deleteTournament(tournament.id)}>Delete</button>
      <button onClick={() => startTournament(tournament.id)}>Start</button>
    </div>
  );
}
