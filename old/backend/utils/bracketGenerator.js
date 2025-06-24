import nearestPowerOfTwo from "./nearestPowerOfTwo.js";

const generateBracket = (players) => {
  const numPlayers = players.length;
  const round = 1;
  const byeCount = Math.abs(nearestPowerOfTwo(numPlayers) - numPlayers);

  const byePlayers = [];
  for (let i = 0; i < byeCount; i++) {
    byePlayers.push(players.pop());
  }

  const matches = [];
  for (let i = 0; i < players.length; i += 2) {
    matches.push({ player1: players[i], player2: players[i + 1] });
  }
  const bracket = [
    {
      roundNumber: round,
      matches: [], // Will be populated with match ObjectIds after creating matches
      byes: byePlayers.map((player) => player._id), // Convert to ObjectIds
    },
  ];

  // Store the match data separately to be processed later
  bracket.matchesData = matches;

  return bracket;
};

export default generateBracket;
