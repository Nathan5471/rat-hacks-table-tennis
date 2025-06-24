import React, { useState, useEffect } from 'react';
import { getPlayerRecentMatches } from '../utils/PlayerAPIHandler';

export default function RecentPlayerMatches({ playerId }) {
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentMatches = async () => {
            try {
                let response;
                if (playerId === undefined) {
                    response = await getPlayerRecentMatches();
                } else {
                    response = await getPlayerRecentMatches(playerId);
                }
                setRecentMatches(response);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
                setRecentMatches([]);
                setLoading(true);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentMatches();
    }, [playerId]);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Recent Matches</h2>
                {recentMatches.length > 0 ? (
                    <ul>
                        {recentMatches.map((match) => (
                            <li key={match._id}>
                                <h3>{match.name}</h3>
                                <p>{match.date}</p>
                                <p>{match.location}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No matches found.</p>
                )}
            </div>
    ))
}