"use client";

import { joinTournament, leaveTournament } from "@/actions/tournamentActions";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import styles from "./tournamentslist.module.css";

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

  // Sort tournaments by status: ongoing first, then upcoming, then completed
  const sortedTournaments = [...tournaments].sort((a, b) => {
    const statusOrder = { ongoing: 0, upcoming: 1, completed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className={styles.tournamentsList}>
      {sortedTournaments.map((tournament) => (
        <div
          key={tournament.id}
          className={`${styles.tournamentCard} ${
            isPending ? styles.loadingState : ""
          }`}
        >
          <div className={styles.tournamentHeader}>
            <h3 className={styles.tournamentName}>{tournament.name}</h3>
            <div className={styles.tournamentStatus}>
              {tournament.status == "completed" && (
                <span
                  className={`${styles.statusBadge} ${styles.statusCompleted}`}
                >
                  completed
                </span>
              )}
              {tournament.status == "ongoing" && (
                <span
                  className={`${styles.statusBadge} ${styles.statusOngoing}`}
                >
                  ongoing
                </span>
              )}
              {tournament.status == "upcoming" && (
                <span
                  className={`${styles.statusBadge} ${styles.statusUpcoming}`}
                >
                  upcoming
                </span>
              )}
            </div>
          </div>

          <div className={styles.tournamentInfo}>
            {tournament.status === "upcoming" ? (
              <div className={styles.participantCount}>
                👥{" "}
                {
                  // For upcoming tournaments, calculate optimistic participant count
                  optimisticMyTournaments.find((t) => t.id == tournament.id)
                    ? // User is in the tournament (either originally or just joined)
                      myTournaments.find((t) => t.id == tournament.id)
                      ? tournament.users.length
                      : tournament.users.length + 1
                    : // User is not in the tournament (either originally or just left)
                    myTournaments.find((t) => t.id == tournament.id)
                    ? tournament.users.length - 1
                    : tournament.users.length
                }{" "}
                / {tournament.size} participants
              </div>
            ) : (
              // For ongoing and completed tournaments, show participant count and rankings
              <div className={styles.tournamentDetails}>
                <div className={styles.participantCount}>
                  👥 {tournament.users.length} participants
                </div>
                {tournament.status === "completed" &&
                  tournament.users.length > 0 && (
                    <div className={styles.rankings}>
                      {(() => {
                        // Sort users by standing (1st, 2nd, 3rd place)
                        const sortedUsers = tournament.users
                          .filter((user) => user.standing && user.standing <= 3)
                          .sort((a, b) => a.standing - b.standing);

                        return sortedUsers.map((userEntry, index) => {
                          const place = userEntry.standing;
                          const emoji =
                            place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
                          const placeText =
                            place === 1
                              ? "Winner"
                              : place === 2
                              ? "2nd Place"
                              : "3rd Place";

                          return (
                            <div
                              key={userEntry.user.id}
                              className={styles.rankingEntry}
                            >
                              {emoji} {placeText}: {userEntry.user.username}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className={styles.tournamentActions}>
            {tournament.status == "upcoming" &&
              (optimisticMyTournaments.find((t) => t.id == tournament.id) ? (
                <button
                  className={`${styles.actionButton} ${styles.leaveButton}`}
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
                  className={`${styles.actionButton} ${styles.joinButton}`}
                  onClick={async () => {
                    startTransition(async () => {
                      optimisticUpdateTournament({
                        action: "join",
                        tournament,
                      });
                      await joinTournament(tournament.id);
                    });
                  }}
                >
                  Join
                </button>
              ) : (
                <span className={styles.roomFullText}>Room Full</span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
