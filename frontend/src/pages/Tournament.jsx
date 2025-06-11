import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTournament, joinTournament, leaveTournament } from '../utils/TournamentAPIHandler';
import { getPlayerSelf } from '../utils/PlayerAPIHandler';
import Sidebar from '../componenets/Sidebar';
import Upcoming from '../componenets/tournamentDisplays/Upcoming';

export default function Tournament() {
    const { id } = useParams();    
    const [tournament, setTournament] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const data = await getTournament(id);
                const playerData = await getPlayerSelf();
                setTournament(data.tournament);
                setIsJoined(data.tournament.playerIds.includes(playerData._id));
                setCanEdit(playerData.accountType === 'admin' || data.tournament.organizerId === playerData._id);
            } catch (error) {
                console.error("Error fetching tournament:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTournament();
    }, [id]);

    const handleJoinTournament = async (e) => {
        e.preventDefault();
        if (tournament.status !== 'upcoming') {
            console.error("Cannot join tournament that is not upcoming");
            return;
        }
        try {
            await joinTournament(id);
            setIsJoined(true);
        } catch (error) {
            console.error("Error joining tournament:", error);
        }
    }

    const handleLeaveTournament = async (e) => {
        e.preventDefault();
        if (tournament.status !== 'upcoming') {
            console.error("Cannot leave tournament that is not upcoming");
            return;
        }
        try {
            await leaveTournament(id);
            setIsJoined(false);
        } catch (error) {
            console.error("Error leaving tournament:", error);
        }
    }

    const handleEditTournament = () => {
        // TODO: Implement edit functionality
    }

    if (loading === true) return (
        <div className="bg-[#011534] text-white p-4 flex flex-col min-w-screen min-h-screen">
            <h2 className="text-2xl">Loading...</h2>
        </div>
    )
    return (
        <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
            <Sidebar />
            <div className="text-white p-4 flex flex-col min-w-[calc(85%)] min-h-screen text-center">
                {tournament.status === 'upcoming' && (
                    <Upcoming 
                        tournament={tournament} 
                        isJoined={isJoined} 
                        canEdit={canEdit} 
                        handleJoin={handleJoinTournament} 
                        handleLeave={handleLeaveTournament} 
                        handleEdit={() => console.log("Edit Tournament")}
                    />
                )}
            </div>
        </div>
    )
}