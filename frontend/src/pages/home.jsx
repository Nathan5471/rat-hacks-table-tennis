import React from 'react';
import PlayerTournaments from "../componenets/PlayerTournaments"
import RecentPlayerMatches from "../componenets/RecentPlayerMatches";
import Leaderboard from "../componenets/Leaderboard";
import Sidebar from "../componenets/Sidebar";

export default function Home() {
    return (
        <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
            <Sidebar />
            <div className=" text-white min-w-[calc(85%)] flex flex-col justify-center items-center ">
                <h1 className="text-4xl">Welcome to the Player Dashboard</h1>
                <div className="mt-4 flex flex-row items-center justify-center">
                    <PlayerTournaments />
                    <RecentPlayerMatches />
                    <Leaderboard />
                </div>
            </div>
        </div>
    )
}