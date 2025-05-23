import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = io('https://f87c-24-149-102-194.ngrok-free.app/', {
        extraHeaders: {
            "ngrok-skip-browser-warning": "true"
    }});

    const joinMatch = (matchId) => {
        try {
            socket.emit('joinmatch', matchId);
            console.log(`Player joined match ${matchId}`);
        } catch (error) {
            console.error(`Error joining match ${matchId}:`, error);
            throw new Error(`Error joining match ${matchId}`);
        }
    }
    
    const handleUpdatedScore = (callback) => {
        const scoreHandler = (scores) => {
            console.log('Score updated:', scores);
            callback(scores);
        }
    
        const gameOverHandler = (data) => {
            console.log('Game over:', data);
            callback(data);
        }
    
        socket.on('scoreUpdate', scoreHandler);
        socket.on('gameOver', gameOverHandler);
    
        return () => {
            socket.off('scoreUpdate', scoreHandler);
            socket.off('gameOver', gameOverHandler);
        }
    }
    
    const updateScore = (matchId, newScore) => {
        try {
            socket.emit('updateScore', { matchId, newScore });
            console.log(`Score updated for match ${matchId}:`, newScore);
        } catch (error) {
            console.error(`Error updating score for match ${matchId}:`, error);
            throw new Error(`Error updating score for match ${matchId}`);
        }
    }
    

    useEffect(() => {
        return () => {
            socket.disconnect();
        }
    })

    const contextValue = {
        joinMatch,
        handleUpdatedScore,
        updateScore,
        socket
    }

    return <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
}
