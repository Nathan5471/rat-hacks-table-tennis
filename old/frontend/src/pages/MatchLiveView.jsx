import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getMatch } from "../utils/MatchAPIHandler";
import LiveScore from "../componenets/liveComponents/LiveScore";
import VideoStream from "../componenets/liveComponents/VideoStream";

export default function MatchLiveView({ id: propId, asComponent = false }) {
  const { id: paramId } = useParams();
  const matchId = propId || paramId;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await getMatch(matchId);
        setMatch(response);
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);
  // Define classes based on whether it's used as a component or full page
  const containerClasses = asComponent
    ? "bg-[#011534] relative flex flex-col w-full h-full"
    : "bg-[#011534] relative flex flex-col min-w-screen min-h-screen";

  const loadingClasses = asComponent
    ? "bg-[#011534] flex flex-row w-full h-full"
    : "bg-[#011534] flex flex-row min-w-screen min-h-screen";

  const headerClasses = asComponent
    ? "bg-[#00245C] text-white flex justify-between p-4 w-full h-16"
    : "bg-[#00245C] text-white flex justify-between p-4 w-full h-[calc(5%)]";

  const contentClasses = asComponent
    ? "grid grid-cols-3 gap-4 p-4 w-full flex-1"
    : "grid grid-cols-3 gap-4 p-4 w-full h-[calc(95%)]";

  return loading === true ? (
    <div className={loadingClasses}>
      <h2 className="text-2xl text-white">Loading...</h2>
    </div>
  ) : (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div></div>
        <h2 className="text-2xl">
          {match.player1Id.fullName} ({match.player1Id.rating}) vs{" "}
          {match.player2Id.fullName} ({match.player2Id.rating})
        </h2>{" "}
        {!asComponent && (
          <h2 className="text-2xl">
            <Link to={`/app/match/${matchId}`}>Exit</Link>
          </h2>
        )}
        {asComponent && <div></div>}
      </div>
      <div className={contentClasses}>
        <div className="col-span-2"></div>
        <LiveScore matchId={matchId} />
      </div>
    </div>
  );
}
