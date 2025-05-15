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
        matches.push({player1: players[i], player2: players[i + 1]});
    }

    const bracket = {
        round,
        matches,
        byePlayers,
    }
    return bracket;
}


export default generateBracket;