import React, { useState } from "react";
import LiveScore from "../liveComponents/LiveScore";
import MatchLiveView from "../../pages/MatchLiveView";
import MatchJudge from "../../pages/MatchJudge";

export default function Ongoing({ tournament }) {
  const [currentMatch, setCurrentMatch] = useState(1);

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col">
      <MatchLiveView id={tournament.bracket[0].matches[0]} asComponent={true} />
      <MatchJudge id={tournament.bracket[0].matches[0]} />
    </div>
  );
}
