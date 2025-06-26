"use client";

import { startTournament } from "@/actions/tournamentActions";
import Link from "next/link";

export function TournamentItem({ tournament }) {
  return (
    <div>
      {tournament.name}{" "}
      <Link href={`/adminpanel/edit/${tournament.id}`}>Edit</Link>{" "}
      <button onClick={() => startTournament(tournament.id)}>Start</button>
    </div>
  );
}
