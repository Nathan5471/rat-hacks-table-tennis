import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlayerSelf } from "../utils/PlayerAPIHandler";
import { logout } from "../utils/AuthAPIHandler";

export default function Sidebar() {
  const [playerInfo, setPlayerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const response = await getPlayerSelf();
        setPlayerInfo(response);
      } catch (error) {
        console.error("Error fetching player info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerInfo();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return loading === true ? (
    <div className="bg-[#00245C] text-white p-5 flex flex-col">
      <h2 className="text-2xl">Loading...</h2>
    </div>
  ) : (
    <div className="bg-[#00245C] text-white p-5 min-w-[calc(15%)] grid grid-rows-[min-content_min-content_1fr] ">
      <h2 className="text-4xl">{playerInfo.fullName.split(" ")[0]}</h2>
      <p className="text-lg  text-gray-500">Rating: {playerInfo.rating}</p>
      <ul className="mt-4 text-2xl">
        <li className="mb-2">
          <Link to="/app/home">Home</Link>
        </li>
        <li className="mb-2">
          <Link to={`/app/player/${playerInfo._id}`}>Profile</Link>
        </li>
        <li className="mb-2">
          <Link to="/app/tournaments">Tournaments</Link>
        </li>
        <li className="mb-2">
          <Link to="/app/leaderboard">Leaderboard</Link>
        </li>
      </ul>
      <div className=""></div>
      <ul className="mt-1 text-2xl">
        <li className="mb-2">
          <button onClick={() => handleLogout()}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
