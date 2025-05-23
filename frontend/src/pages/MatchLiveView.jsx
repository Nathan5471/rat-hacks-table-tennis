import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatch } from '../utils/MatchAPIHandler';
import { joinMatch, handleUpdatedScore } from '../utils/SocketService';


export default function MatchLiveView() {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await getMatch(id);
                setMatch(response);
                setPlayers({
                    player1: response.player1Id,
                    player2: response.player2Id
                })
            } catch (error) {
                console.error("Error fetching match:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id]);

    return (
        loading === true ? (
            <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
                <h2 className="text-2xl text-white">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#011534] relative flex flex-col min-w-screen min-h-screen">
                <div className="bg-[#00245C] text-white flex justify-between p-4 w-full h-[calc(5%)]">
                    <div></div>
                    <h2 className="text-2xl">{players.player1.fullName} ({players.player1.rating}) vs {players.player2.fullName} ({players.player2.rating})</h2>
                    <h2 className="text-2xl"><Link to={`/app/match/${id}`}>Exit</Link></h2>
                </div>
            </div>
        )
    )
}