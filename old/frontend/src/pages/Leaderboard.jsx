import React, { useEffect, useState } from 'react';
import { getTopRatings } from '../utils/PlayerAPIHandler.js';
import Sidebar from '../componenets/Sidebar.jsx';

export default function Leaderboard() {
    const [topRatings, setTopRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRatings = async () => {
            try {
                const rating = await getTopRatings();
                setTopRatings(rating);
            } catch (error) {
                console.error("Error fetching top ratings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTopRatings();
    }, []);

    return (
        loading === true ? (
            <div className="bg-[#011534] flex flex-row min-w-screen h-screen">
                <Sidebar />
                <div className="text-white min-w-[calc(85%)] overflow-scroll flex flex-col text-center justify-center items-center">
                    <h1 className="text-4xl">Loading...</h1>
                </div>
            </div>
        ) : (
            <div className="bg-[#011534] flex flex-row min-w-screen h-screen">
                <Sidebar />
                <div className="text-white min-w-[calc(85%)] overflow-scroll flex flex-col text-center justify-center">
                    <h1 className="text-4xl">Top 25 Leaderboard</h1>
                    <div className="mt-4 flex flex-col items-center">
                    <ul className="mt-4">
                        {topRatings.map((player, index) => (
                            <li key={player._id} className="mb-2">
                                <p>{index + 1}. {player.fullName} - Rating: {player.rating}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            </div>
        )
    )
}