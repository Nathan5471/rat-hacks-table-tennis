import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../utils/PlayerAPIHandler';
import Sidebar from '../componenets/Sidebar';
import RecentPlayerMatches from '../componenets/RecentPlayerMatches';
import PlayerTournaments from '../componenets/PlayerTournaments';
import RatingHistoryGraph from '../componenets/RatingHistoryGraph';

export default function Player() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await getPlayer(id);
                setPlayer(response);
            } catch (error) {
                console.error("Error fetching player:", error);
                setPlayer(null);
                setLoading(true);
            } finally {
                setLoading(false);
            }
        }
        fetchPlayer();
    }
    , [id]);
    return (
        loading === true ? (
            <div className="bg-[#011534] text-white p-4 flex flex-col min-w-screen min-h-screen">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#011534] text-white flex flex-row min-w-screen min-h-screen">
                <Sidebar />
                <div className=" text-white p-4 flex flex-col min-w-[calc(85%)] min-h-screen">
                    {player ? (
                        <>
                            <h2 className="text-2xl">{player.fullName} - Rating: {player.rating}</h2>
                            <RatingHistoryGraph playerId={player._id} />
                            <div className="mt-4 flex flex-row items-center justify-center">
                                <PlayerTournaments playerId={player._id} />
                                <RecentPlayerMatches playerId={player._id} />
                            </div>
                        </>
                    ) : (
                        <p>Player not found</p>
                    )}
                </div>
            </div>
        )
    )
}