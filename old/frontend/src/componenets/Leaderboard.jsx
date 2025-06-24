import React, { useState, useEffect } from 'react';
import { getTopRatings } from '../utils/PlayerAPIHandler';

export default function Leaderboard() {
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopPlayers = async () => {
            try {
                const response = await getTopRatings();
                setTopPlayers(response);
            } catch (error) {
                console.error("Error fetching top players:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTopPlayers();
    }
    , []);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Leaderboard</h2>
                <ul className="mt-4">
                    {topPlayers.map((player, index) => (
                        <li key={player._id} className="mb-2">
                            <p>{index + 1}. {player.fullName} - Rating: {player.rating}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    )
}