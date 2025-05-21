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
            <div className="bg-[#00245C] text-white p-4 flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 flex flex-col">
                <h2 className="text-2xl">{playerInfo.fullName.split(' ')[0]}</h2>
                <p className="text-sm  text-gray-200">Rating: {playerInfo.rating}</p>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/tournaments">Tournaments</Link>
                    </li>
                    <li>
                        <Link to="/players">Players</Link>
                    </li>
                </ul>
            </div>
        )
    )
}