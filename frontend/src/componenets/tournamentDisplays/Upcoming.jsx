import React from 'react';

export default function Upcoming({ tournament, isJoined, canEdit, handleJoin, handleLeave, handleEdit }) {
    return(
        <div className="bg-[#00245C] flex flex-row rounded-lg p-4">
            <div className="flex flex-col text-left">
                <h1 className="text-4xl">{tournament.name} ({tournament.status})</h1>
                <p className="text-xl text-gray-300">Location: {tournament.location}</p>
                <p className="text-xl text-gray-300">Starts: {new Date(tournament.startDate).toLocaleString()}</p>
            </div>
            <div className="flex flex-col ml-auto">
                {isJoined ? (
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={handleLeave}
                    >
                        Leave Tournament
                    </button>
                ) : (
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={handleJoin}
                    >
                        Join Tournament
                    </button>
                )}
                {canEdit && (
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={handleEdit}
                    >
                        Edit Tournament
                    </button>
                )}
            </div>
        </div>
    )
    
}