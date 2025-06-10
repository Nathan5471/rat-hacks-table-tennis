import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    
    useEffect(() => {
        socketRef.current = io('https://hqe8ka-ip-24-149-102-194.tunnelmole.net/');
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, []);

    const joinMatch = (matchId) => {
        try {
            socketRef.current.emit('joinmatch', matchId);
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
    
        socketRef.current.on('scoreUpdate', scoreHandler);
        socketRef.current.on('gameOver', gameOverHandler);
    
        return () => {
            socketRef.current.off('scoreUpdate', scoreHandler);
            socketRef.current.off('gameOver', gameOverHandler);
        }
    }
    
    const updateScore = (matchId, newScore) => {
        try {
            socketRef.current.emit('updateScore', { matchId, newScore });
            console.log(`Score updated for match ${matchId}:`, newScore);
        } catch (error) {
            console.error(`Error updating score for match ${matchId}:`, error);
            throw new Error(`Error updating score for match ${matchId}`);
        }
    }

    const contextValue = {
        joinMatch,
        handleUpdatedScore,
        updateScore,
    }

    return <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
}
