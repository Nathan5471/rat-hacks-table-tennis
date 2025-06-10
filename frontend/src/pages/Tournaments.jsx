import React, { useEffect, useState } from 'react';
import { getTournaments } from '../utils/TournamentAPIHandler';
import { getPlayerSelf } from '../utils/PlayerAPIHandler';
import TournamentCard from '../componenets/TournamentCard';
import Sidebar from '../componenets/Sidebar';
import { Overlay } from '../componenets/Overlay';

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const data = await getTournaments();
                const playerData = await getPlayerSelf();
                setTournaments(data.tournaments);
                setPlayerId(playerData._id);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTournaments();
    }, [])

    if (loading === true) return (
        <div className="bg-[#011534] text-white p-4 flex flex-col min-w-screen min-h-screen">
            <h2 className="text-2xl">Loading...</h2>
        </div>
    ) 

    return (
        <>
        <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
            <Sidebar />
            <div className="text-white p-4 flex flex-col min-w-[calc(85%)] min-h-screen">
                <h2 className="text-2xl mb-4">Tournaments</h2>
                {tournaments.length === 0 ? (
                    <p className="text-lg">No tournaments available at the moment.</p>
                ) : (
                    <>
                    {tournaments.map((tournament) => (
                        <TournamentCard 
                            key={tournament._id} 
                            tournament={tournament} 
                            playerId={playerId} 
                        />
                    ))}
                    </>
                )}
            </div>
        </div>
        <Overlay />
        </>
    )
}