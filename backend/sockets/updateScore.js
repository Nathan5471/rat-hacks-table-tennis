import { findWinner } from '../utils/findWinner.js';
import Match from '../models/match.js';
import { endMatch } from '../controllers/matchController.js';

const matachData = {};

export default (io, socket) => {

    const joinMatch = (matchId) => {
        if (!matachData[matchId]) {
            matachData[matchId] = { player1Score: 0, player2Score: 0 };
        }
        socket.join(matchId);
        console.log(`Player joined match ${matchId}`);
    }

    const updateScore = ({ matchId, newScore }) => {
        if (newScore.player1Score !== undefined) {
            const player1Score = newScore.player1Score;
            matachData[matchId].player1Score = player1Score;
        }
        if (newScore.player2Score !== undefined) {
            const player2Score = newScore.player2Score;
            matachData[matchId].player2Score = player2Score;
        }

        const player1Score = matachData[matchId].player1Score;
        const player2Score = matachData[matchId].player2Score;
        const winner = findWinner(player1Score, player2Score);
        if (winner) {
            const scores = {
                player1Score: matachData[matchId].player1Score,
                player2Score: matachData[matchId].player2Score,
            };
            io.to(matchId).emit('gameOver', { scores, winner });
            winnerHandler(matchId);
            delete matachData[matchId];
        } else {
            io.to(matchId).emit('scoreUpdate', { player1Score, player2Score });
        }
    }

    const winnerHandler = async (matchId) => {
        try {
            const match = await Match.findById(matchId);
            const scores = matachData[matchId];
            if (!match) {
                console.error(`Match with ID ${matchId} not found`);
                return;
            }
            const winner = findWinner(scores.player1Score, scores.player2Score);
            let winnerId;
            if (winner === 1) {
                winnerId = match.player1Id;
            } else if (winner === 2) {
                winnerId = match.player2Id;
            } else {
                console.error(`No winner found for match ${matchId}`);
                return;
            }
            await endMatch(matchId, winnerId, scores)
            console.log(`Match ${matchId} ended. Player ${winnerId} wins!`);
        } catch (error) {
            console.error(`Error ending match ${matchId}:`, error);
        }
    }

    socket.on('joinmatch', (matchId) => {
        joinMatch(matchId);
    });
    socket.on('updateScore', (newScore) => {
        updateScore(newScore);
    });
}