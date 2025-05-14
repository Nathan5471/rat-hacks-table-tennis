import nearestPowerOfTwo from "./nearestPowerOfTwo";
import Match from "../models/match";

const generateBracket = (players, format) => {
    let bracket = [];
    try {
        switch (format) {
            case 'single-elimination':
                bracket = generateSingleEliminationBracket(players);
                break;
            case 'double-elimination':
                bracket = generateDoubleEliminationBracket(players);
                break;
            case 'round-robin':
                bracket = generateRoundRobinBracket(players);
                break;
            default:
                throw new Error('Invalid tournament format');
        }
    } catch (error) {
        console.error('Error generating bracket:', error);
        throw new Error('Bracket generation failed');
    }
    return bracket;
}


const generateSingleEliminationBracket = (players) => {
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

    return {
        round,
        matches,
        byePlayers,
    }
};

const generateDoubleEliminationBracket = (players) => {
};

const generateRoundRobinBracket = (players) => {
};

export default generateBracket;