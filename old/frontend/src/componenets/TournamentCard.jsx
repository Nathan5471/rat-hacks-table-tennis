import React from "react";
import { Link } from "react-router-dom";
import {
  joinTournament,
  leaveTournament,
  deleteTournament,
} from "../utils/TournamentAPIHandler";

export default function TournamentCard({
  tournament,
  playerId,
  setRefreshTournaments,
  canDelete,
}) {
  const { _id, name, location, startDate, playerIds, status } = tournament;
  const isPlayerRegistered = playerIds.includes(playerId);

  const handleJoinTournament = async () => {
    await joinTournament(_id);
    setRefreshTournaments((prev) => !prev);
  };

  const handleLeaveTournament = async () => {
    await leaveTournament(_id);
    setRefreshTournaments((prev) => !prev);
  };

  const handleDeleteTournament = async () => {
    await deleteTournament(_id);
    setRefreshTournaments((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-row bg-[#00245C] text-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex flex-col">
        <h3 className="text-xl mb-1">
          {name} ({status})
        </h3>
        <p className="text-md text-gray-300">Location: {location}</p>
        <p className="text-md text-gray-300">
          Starts: {new Date(startDate).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-row ml-auto">
        <Link to={`/app/tournament/${_id}`} className="h-full flex mx-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Details
          </button>
        </Link>
        {status === "upcoming" && (
          <>
            {isPlayerRegistered === true ? (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLeaveTournament}
              >
                Leave Tournament
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleJoinTournament}
              >
                Join Tournament
              </button>
            )}
            {canDelete && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDeleteTournament}
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
