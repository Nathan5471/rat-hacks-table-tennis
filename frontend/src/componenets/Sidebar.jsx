import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getPlayer } from '../utils/PlayerAPIHandler';

export default function Sidebar() {
    const [playerInfo, setPlayerInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            try {
                const response = await getPlayer();
                setPlayerInfo(response);
            } catch (error) {
                console.error("Error fetching player info:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPlayerInfo();
    }, []);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-5 flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-5 min-w-[calc(15%)] flex flex-col ">
                <h2 className="text-4xl">{playerInfo.fullName.split(' ')[0]}</h2>
                <p className="text-lg  text-gray-500">Rating: {playerInfo.rating}</p>
                <ul className="mt-4 text-2xl">
                    <li className="mb-2">
                        <Link to="/app/home">Home</Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/app/profile">Profile</Link>
                    </li>
                    <li className="mb-2">
                        <Link to="app/tournaments">Tournaments</Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/app/leaderboard">Leaderboard</Link>
                    </li>
                </ul>
            </div>
        )
    )
}