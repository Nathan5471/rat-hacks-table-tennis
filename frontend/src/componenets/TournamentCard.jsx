import React from 'react';
import { Link } from 'react-router-dom';
import { joinTournament, leaveTournament } from '../utils/TournamentAPIHandler';

export default function TournamentCard({ tournament, playerId }) {
    const { _id, name, location, startDate, playerIds, status } = tournament;
    const isPlayerRegistered = playerIds.includes(playerId);

    return (
        <div className="w-full flex flex-cols bg-[#011534] text-white p-4 rounded-lg shadow-md mb-4">
            <p>Test</p>
        </div>
    )
}