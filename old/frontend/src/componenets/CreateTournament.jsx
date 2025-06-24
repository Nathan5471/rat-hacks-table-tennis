import React, { useState } from 'react';
import { useOverlay } from '../contexts/OverlayContext';
import { createTournament } from '../utils/TournamentAPIHandler';

export default function CreateTournament({setRefreshTournaments}) {
    const { closeOverlay } = useOverlay();
    const [tournamentName, setTournamentName] = useState('');
    const [tournamentLocation, setTournamentLocation] = useState('');
    const [tournamentDate, setTournamentDate] = useState('');
    const [timeBetweenMatches, setTimeBetweenMatches] = useState('');
    const [error, setError] = useState('');

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        setError('');
        if (!tournamentName || !tournamentLocation || !tournamentDate || !timeBetweenMatches) {
            setError('All fields are required');
            return;
        }
        try {
            await createTournament({
                name: tournamentName,
                location: tournamentLocation,
                startDate: tournamentDate,
                timeBetweenMatch: timeBetweenMatches
            })
            setTournamentName('');
            setTournamentLocation('');
            setTournamentDate('');
            setTimeBetweenMatches('');
            setRefreshTournaments(prev => !prev);
            closeOverlay();
        } catch (error) {
            setError(error || 'An error occurred while creating the tournament');
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        setError('');
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl mb-4">Create Tournament</h2>
            <form className="flex flex-col" onSubmit={handleCreateTournament}>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <label className="mb-1">Tournament Name:</label>
                <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <label className="mb-1">Location:</label>
                <input
                    type="text"
                    value={tournamentLocation}
                    onChange={(e) => setTournamentLocation(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <label className="mb-1">Date:</label>
                <input
                    type="datetime-local"
                    value={tournamentDate}
                    onChange={(e) => setTournamentDate(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <label className="mb-1">Time Between Matches (in minutes):</label>
                <input
                    type="number"
                    value={timeBetweenMatches}
                    onChange={(e) => setTimeBetweenMatches(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <div className="flex flex-row w-full justify-around">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[calc(50%-0.5rem)]"
                    >Submit</button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[calc(50%-0.5rem)]"
                    >Close</button>
                </div>
                
            </form>
        </div>
    )
}