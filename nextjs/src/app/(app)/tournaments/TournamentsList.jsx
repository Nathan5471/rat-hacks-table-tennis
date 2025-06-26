"use client";

import { joinTournament, leaveTournament } from "@/actions/tournamentActions";
import { useOptimistic, useTransition } from "react";

export default function TournamentsList({ tournaments, myTournaments }) {
  const [optimisticMyTournaments, optimisticUpdateTournament] = useOptimistic(
    myTournaments,
    (state, { action, tournament }) => {
      if (action == "leave") {
        return state.filter((t) => t.id != tournament.id);
      }
      if (action == "join") {
        return [...state, tournament];
      }
    }
  );

  const [isPending, startTransition] = useTransition();

  return (
    <>
      {tournaments.map((tournament) => (
        <div key={tournament.id}>
          {tournament.name}{" "}
          {tournament.status == "upcoming" &&
            (optimisticMyTournaments.find((t) => t.id == tournament.id) ? (
              <button
                onClick={async () => {
                  startTransition(async () => {
                    optimisticUpdateTournament({
                      action: "leave",
                      tournament,
                    });
                    await leaveTournament(tournament.id);
                  });
                }}
              >
                Leave
              </button>
            ) : tournament.users.length < tournament.size ? (
              <button
                onClick={async () => {
                  startTransition(async () => {
                    optimisticUpdateTournament({ action: "join", tournament });
                    await joinTournament(tournament.id);
                  });
                }}
              >
                Join
              </button>
            ) : (
              <>Room Full</>
            ))}
        </div>
      ))}
    </>
  );
}
