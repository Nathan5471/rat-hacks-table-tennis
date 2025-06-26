"use client";

import { leaveTournament } from "@/actions/tournamentActions";
import { useOptimistic } from "react";

export default function TournamentsList({ tournaments, myTournaments }) {
  const [optimisticMyTournaments, optimisticLeaveTournament] = useOptimistic(
    myTournaments,
    (state, id) => {
      return state.filter((tournament) => tournament.id != id);
    }
  );

  return (
    <>
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          {tournament.name}{" "}
          {optimisticMyTournaments.find((t) => t.id == tournament.id) ? (
            <button
              onClick={async () => {
                optimisticLeaveTournament(tournament.id);
                await leaveTournament(tournament.id);
              }}
            >
              Leave
            </button>
          ) : (
            <button onClick={() => {}}>Join</button>
          )}
        </div>
      ))}
    </>
  );
}
