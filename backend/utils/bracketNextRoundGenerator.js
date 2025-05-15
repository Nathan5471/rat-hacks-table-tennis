import Match from "../models/match.js";

const generateNextRound = async (currentRoundData) => {
    const currentRound = currentRoundData.roundNumber;
    const matchIds = currentRoundData.matches;
    const byePlayers = currentRoundData.byes;
    const winnerIds = [];
    for (let i = 0; i < matchIds.length; i++) {
        const match = await Match.findById(matchIds[i]);
        if (!match) {
            throw new Error("Match not found");
        }
        if (match.winnerId) {
            winnerIds.push(match.winnerId);
        }
    }
    let nextRoundMatches = [];
    for (let i = 0; i < byePlayers.length; i ++) {
        nextRoundMatches.push({
            player1: byePlayers[i],
            player2: winnerIds.pop()
        })
    }
    for (let i = 0; i < winnerIds.length; i += 2) {
        nextRoundMatches.push({
            player1: winnerIds[i],
            player2: winnerIds[i + 1]
        })
    }
    const nextRound = {
        roundNumber: currentRound + 1,
        matches: nextRoundMatches,
        byes: []
    }
    return nextRound;
}

export default generateNextRound;