import { io } from 'socket.io-client';

const socket = io('https://5084-24-149-102-194.ngrok-free.app/')

export const joinMatch = (matchId) => {
    try {
        socket.emit('joinmatch', matchId);
        console.log(`Player joined match ${matchId}`);
    } catch (error) {
        console.error(`Error joining match ${matchId}:`, error);
        throw new Error(`Error joining match ${matchId}`);
    }
}

export const handleUpdatedScore = (callback) => {
    socket.on('scoreUpdate', (scores) => {
        console.log('Score updated:', scores);
        callback(scores);
    });

    socket.on('gameOver', (data) => {
        console.log('Game over:', data);
        callback(data);
    });
}

export const updateScore = (matchId, newScore) => {
    try {
        socket.emit('updateScore', { matchId, newScore });
        console.log(`Score updated for match ${matchId}:`, newScore);
    } catch (error) {
        console.error(`Error updating score for match ${matchId}:`, error);
        throw new Error(`Error updating score for match ${matchId}`);
    }
}
