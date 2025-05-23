import React, { useEffect, useState } from "react";
import { handleUpdatedScore } from "../../utils/SocketService";

export default function LiveScore() {
    const [score, setScore] = useState({ player1Score: 0, player2Score: 0 });

    useEffect(() => {
        const cleanup = handleUpdatedScore((data) => {
            if (data.scores) {
                setScore(data.scores);
            } else {
                console.log("Game over:", data);
            }
        });
        return () => {
            cleanup && cleanup();
        };
    }, []);

    return (
        <div className="bg-[#00245C] text-white p-4 rounded-lg shadow-md flex">
            <h2 className="text-6xl">{score.player1Score} - {score.player2Score}</h2>
        </div>
    )
    
}