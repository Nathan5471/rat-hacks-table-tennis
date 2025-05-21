import React, {useEffect, useState} from 'react';
import {getPlayerTournaments} from "../utils/PlayerAPIHandler";

export default function PlayerTournaments() {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getPlayerTournaments();
                setTournaments(response);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        }
        fetchTournaments();
    })

    return (
        <div>
            <h2>Tournaments</h2>
            {tournaments.length > 0 ? (
                <ul>
                    {tournaments.map((tournament) => (
                        <li key={tournament.id}>
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
    )
}