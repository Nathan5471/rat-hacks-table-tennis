import React from 'react';
import PlayerTournaments from "../componenets/PlayerTournaments"
import Sidebar from "../componenets/Sidebar";

export default function Home() {
    return (
        <div className="bg-[#011534] flex flex-row">
            <Sidebar />
            <div className=" text-white min-w-screen min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl">Welcome to the Player Dashboard</h1>
                <PlayerTournaments />
            </div>
        </div>
    )
}