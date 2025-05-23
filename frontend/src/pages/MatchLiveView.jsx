import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatch } from '../utils/MatchAPIHandler';
import LiveScore from '../componenets/liveComponents/LiveScore';
import VideoStream from '../componenets/liveComponents/VideoStream';


export default function MatchLiveView() {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await getMatch(id);
                setMatch(response);
            } catch (error) {
                console.error("Error fetching match:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id]);

    return (
        loading === true ? (
            <div className="bg-[#011534] flex flex-row min-w-screen min-h-screen">
                <h2 className="text-2xl text-white">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#011534] relative flex flex-col min-w-screen min-h-screen">
                <div className="bg-[#00245C] text-white flex justify-between p-4 w-full h-[calc(5%)]">
                    <div></div>
                    <h2 className="text-2xl">{match.player1Id.fullName} ({match.player1Id.rating}) vs {match.player2Id.fullName} ({match.player2Id.rating})</h2>
                    <h2 className="text-2xl"><Link to={`/app/match/${id}`}>Exit</Link></h2>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 w-full h-[calc(95%)]">
                    <div className="col-span-2">
                        <VideoStream />
                    </div>
                    <LiveScore matchId={id}/>
                </div>
            </div>
        )
    )
}