import React, {useEffect, useState} from 'react';
import {getPlayerTournaments} from "../utils/PlayerAPIHandler";

export default function PlayerTournaments({ playerId }) {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                let response;
                if (playerId === undefined) {
                    response = await getPlayerTournaments();
                } else {
                    response = await getPlayerTournaments(playerId);
                }
                setTournaments(response);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
                setTournaments([]);
                setLoading(true);
            } finally {
                setLoading(false);
            }
        }
        fetchTournaments();
    }, [playerId]);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Tournaments</h2>
                {tournaments.length > 0 ? (
                    <ul>
                        {tournaments.map((tournament) => (
                            <li key={tournament._id}>
                                <h3>{tournament.name}</h3>
                                <p>{tournament.date}</p>
                                <p>{tournament.location}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tournaments found.</p>
                )}
            </div>
    ))
}