import { findWinner } from '../utils/findWinner.js';
import Match from '../models/match.js';
import { endMatch } from '../controllers/matchController.js';

let matachData = {};

export default (io, socket) => {

    const joinMatch = (matchId) => {
        if (!matachData[matchId]) {
            matachData[matchId] = { player1Score: 0, player2Score: 0 };
        }
        console.log(`Match data for ${matchId}:`, matachData[matchId]);
        socket.join(matchId);
        socket.to(matchId).emit('scoreUpdate', matachData[matchId]);
        console.log(`Player joined match ${matchId}`);
    }

    const updateScore = ({ matchId, newScore }) => {
        if (newScore.player1 !== undefined) {
            const player1Score = newScore.player1;
            matachData[matchId].player1Score = player1Score;
        }
        if (newScore.player2 !== undefined) {
            const player2Score = newScore.player2;
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

    const getScore = (matchId) => {
        return matachData[matchId];
    }

    socket.on('joinmatch', (matchId) => {
        joinMatch(matchId);
    });
    socket.on('updateScore', (newScore) => {
        updateScore(newScore);
    });
    socket.on('getScore', (matchId) => {
        const score = getScore(matchId);
        socket.to(matchId).emit('scoreUpdate', score);
    });
}