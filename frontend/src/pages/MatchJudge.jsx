import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatch } from '../utils/MatchAPIHandler';
import { useSocket } from '../contexts/SocketContext';


export default function MatchJudge() {
    const { joinMatch, updateScore } = useSocket();
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [score, setScore] = useState({ player1: 0, player2: 0 });
    const [loading, setLoading] = useState(true);

    joinMatch(id);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await getMatch(id);
                setMatch(response);
            } catch (error) {
                console.error("Error fetching match:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id]);

    const handleScoreUpdate = async (playerScored) => {
        const newScore = { ...score };
        if (playerScored === 'player1') {
            newScore.player1 += 1;
        } else if (playerScored === 'player2') {
            newScore.player2 += 1;
        }
        setScore(newScore);
        await updateScore(id, newScore);
    }

    return (
        loading === true ? (
            <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
                <h2 className="text-2xl text-white">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#011534] relative flex flex-col min-w-screen min-h-screen">
                <div className="bg-[#00245C] text-white flex justify-between p-4 w-full h-[calc(5%)]">
                    <div></div>
                    <h2 className="text-2xl">{match.player1Id.fullName} ({match.player1Id.rating}) vs {match.player2Id.fullName} ({match.player2Id.rating})</h2>
                    <h2 className="text-2xl"><Link to={`/app/match/${id}`}>Exit</Link></h2>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 h-[calc(95%)]">
                    <div className="grid grid-cols-1 gap-4">
                        <h2 className="text-3xl text-white text-center">{match.player1Id.fullName}</h2>
                        <button onClick={() => handleScoreUpdate('player1')} className="bg-blue-500 text-white p-2 m-2 rounded">{score.player1}</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <h2 className="text-3xl text-white text-center">{match.player2Id.fullName}</h2>
                        <button onClick={() => handleScoreUpdate('player2')} className="bg-blue-500 text-white p-2 m-2 rounded">{score.player2}</button>
                    </div>
                </div>
            </div>
        )
    )
}