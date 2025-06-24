import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";

export default function LiveScore({ matchId }) {
    const { joinMatch, handleUpdatedScore } = useSocket();
    const [score, setScore] = useState({ player1Score: 0, player2Score: 0 });

    joinMatch(matchId);

    useEffect(() => {
        const cleanup = handleUpdatedScore((data) => {
            setScore(data)
            console.log("Game over:", data);
            }
        );
        return () => {
            cleanup && cleanup();
        };
    }, [handleUpdatedScore]);

    return (
        <div className="bg-[#00245C] text-white p-4 rounded-lg shadow-md flex">
            <h2 className="text-6xl">{score.player1Score} - {score.player2Score}</h2>
        </div>
    )
    
}