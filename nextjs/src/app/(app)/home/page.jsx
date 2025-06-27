import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { eq, and, desc, or } from "drizzle-orm";
import { tournaments, matches, tournamentUsers } from "database/schema";
import styles from "./home.module.css";

export default async function Home() {
  const db = await getDbAsync();
  const username = await authenticated();

  if (!username) {
    return <div>Error</div>;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) {
    return <div>Error: User not found</div>;
  }

  // Get past tournaments the user participated in
  const pastTournaments = await db.query.tournamentUsers.findMany({
    where: and(eq(tournamentUsers.userId, user.id)),
    with: {
      tournament: true,
    },
    orderBy: desc(tournamentUsers.tournamentId),
    limit: 10,
  });

  // Get recent matches for the user
  const recentMatchesRaw = await db
    .select({
      id: matches.id,
      player1Id: matches.player1Id,
      player2Id: matches.player2Id,
      player1Score: matches.player1Score,
      player2Score: matches.player2Score,
      tournamentId: matches.tournamentId,
    })
    .from(matches)
    .where(or(eq(matches.player1Id, user.id), eq(matches.player2Id, user.id)))
    .orderBy(desc(matches.id))
    .limit(10);

  // Get additional data for matches
  const recentMatches = await Promise.all(
    recentMatchesRaw.map(async (match) => {
      const [player1, player2, tournament] = await Promise.all([
        db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, match.player1Id),
        }),
        db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, match.player2Id),
        }),
        db.query.tournaments.findFirst({
          where: (tournaments, { eq }) =>
            eq(tournaments.id, match.tournamentId),
        }),
      ]);

      return {
        ...match,
        player1,
        player2,
        tournament,
      };
    })
  );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.userInfo}>
        <h1 className={styles.userRating}>
          Rating: {user.rating ? user.rating : "Not Rated Yet"}
        </h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Past Tournaments</h2>
        <div className={styles.itemsList}>
          {pastTournaments.length > 0 ? (
            pastTournaments.map((tournamentUser) => (
              <div
                key={tournamentUser.tournament.id}
                className={styles.tournamentItem}
              >
                <div className={styles.tournamentInfo}>
                  <h3 className={styles.tournamentName}>
                    {tournamentUser.tournament.name}
                  </h3>
                  <div className={styles.tournamentDetails}>
                    {tournamentUser.tournament.size} players •{" "}
                    {tournamentUser.tournament.status}
                  </div>
                </div>
                {tournamentUser.standing && (
                  <div className={styles.tournamentStanding}>
                    {tournamentUser.standing === 1
                      ? "🏆 Winner"
                      : tournamentUser.standing === 2
                      ? "🥈 2nd Place"
                      : tournamentUser.standing === 3
                      ? "🥉 3rd Place"
                      : `${tournamentUser.standing}${getOrdinalSuffix(
                          tournamentUser.standing
                        )} Place`}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              No tournament history yet. Join a tournament to get started!
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Matches</h2>
        <div className={styles.itemsList}>
          {recentMatches.length > 0 ? (
            recentMatches.map((match) => {
              const isPlayer1 = match.player1Id === user.id;
              const opponent = isPlayer1 ? match.player2 : match.player1;
              const userScore = isPlayer1
                ? match.player1Score
                : match.player2Score;
              const opponentScore = isPlayer1
                ? match.player2Score
                : match.player1Score;
              const won = userScore > opponentScore;

              return (
                <div key={match.id} className={styles.matchItem}>
                  <div className={styles.matchPlayers}>
                    <div
                      className={`${styles.matchPlayer} ${
                        won ? styles.winnerPlayer : ""
                      }`}
                    >
                      You: {userScore}
                    </div>
                    <div
                      className={`${styles.matchPlayer} ${
                        !won ? styles.winnerPlayer : ""
                      }`}
                    >
                      {opponent.username}: {opponentScore}
                    </div>
                    <div className={styles.matchTournament}>
                      in {match.tournament.name}
                    </div>
                  </div>
                  <div className={styles.matchScore}>
                    {won ? "W" : "L"} {userScore}-{opponentScore}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              No match history yet. Play in a tournament to see your matches
              here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}
