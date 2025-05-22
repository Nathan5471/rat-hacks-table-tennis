import React, { useState, useEffect } from 'react';
import { getPlayerRecentMatches } from '../utils/PlayerAPIHandler';

export default function RecentPlayerMatches() {
    const [recentMatches, setRecentMatches] = useState([]);

    useEffect(() => {
        const fetchRecentMatches = async () => {
            try {
                const response = await getPlayerRecentMatches();
                setRecentMatches(response);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } 
        }
        fetchRecentMatches();
    }, []);

    return (
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
    )
}