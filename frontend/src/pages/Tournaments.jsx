import React, { useEffect, useState } from 'react';
import { getTournaments } from '../utils/TournamentAPIHandler';
import { getPlayerSelf } from '../utils/PlayerAPIHandler';
import TournamentCard from '../componenets/TournamentCard';
import Sidebar from '../componenets/Sidebar';
import { Overlay } from '../componenets/Overlay';
import { useOverlay } from '../contexts/OverlayContext';
import CreateTournament from '../componenets/CreateTournament';

export default function Tournaments() {
    const { openOverlay } = useOverlay();
    const [tournaments, setTournaments] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [canCreateTournament, setCanCreateTournament] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshTournaments, setRefreshTournaments] = useState(false);

    const handleCreateTournament = (e) => {
        e.preventDefault();
        openOverlay(<CreateTournament setRefreshTournaments={setRefreshTournaments}/>);
    }

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const data = await getTournaments();
                const playerData = await getPlayerSelf();
                setTournaments(data.tournaments);
                setPlayerId(playerData._id);
                setCanCreateTournament(playerData.accountType === 'admin' || playerData.accountType === 'organizer');
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        }
        setLoading(true);
        fetchTournaments();
    }, [refreshTournaments])

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
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-2xl">Tournaments</h1>
                    {canCreateTournament && (
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleCreateTournament}
                        >
                            Create Tournament
                        </button>
                    )}
                </div>
                {tournaments.length === 0 ? (
                    <p className="text-lg">No tournaments available at the moment.</p>
                ) : (
                    <>
                    {tournaments.map((tournament) => (
                        <TournamentCard 
                            key={tournament._id} 
                            tournament={tournament} 
                            playerId={playerId}
                            setRefreshTournaments={setRefreshTournaments}
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