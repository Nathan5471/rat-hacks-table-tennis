"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import styles from "./manager.module.css";

export default function Manager({ token }) {
  const { id } = useParams();
  const router = useRouter();

  const connection = useRef(null);

  // Tournament state variables
  const [size, setSize] = useState(null);
  const [roundIndex, setRoundIndex] = useState(null);
  const [matchIndex, setMatchIndex] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [scores, setScores] = useState([null, null]);

  const send = (event, data) => {
    if (
      connection.current &&
      connection.current.readyState === WebSocket.OPEN
    ) {
      connection.current.send(JSON.stringify({ event, data }));
    }
  };

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_SERVER + "/ws/" + id
    );

    let socketOns = [];

    function on(event, callback) {
      socketOns.push({ event, callback });
    }

    on(
      "tournamentState",
      ({ size, roundIndex, matchIndex, player1, player2, scores }) => {
        setSize(size);
        setRoundIndex(roundIndex);
        setMatchIndex(matchIndex);
        setPlayer1(player1);
        setPlayer2(player2);
        setScores(scores);
      }
    );

    on("scores", ({ scores }) => {
      setScores(scores);
    });

    on("tournamentOver", ({ winner }) => {
      alert(winner + " won");
      router.push("/adminpanel");
    });

    socket.addEventListener("open", (e) => {
      send("admin", { token });
    });

    socket.addEventListener("message", (e) => {
      const { event, data } = JSON.parse(e.data);
      handleEvent(event, data);
    });

    function handleEvent(event, data) {
      console.log(data);
      const socketOn = socketOns.find((s) => s.event == event);

      if (!socketOn) {
        console.log(`No handler found for event: ${event}`);
      }

      socketOn.callback(data);
    }

    connection.current = socket;

    return () => connection.current.close();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.tournamentInfo}>
        <div className={styles.tournamentTitle}>
          Tournament {id} - {size} Players
        </div>
        <div className={styles.matchInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Round</div>
            <div className={styles.infoValue}>{roundIndex + 1}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Match</div>
            <div className={styles.infoValue}>{matchIndex + 1}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Status</div>
            <div className={styles.infoValue}>Live</div>
          </div>
        </div>
      </div>

      <div className={styles.scoreSection}>
        <div className={styles.versusDisplay}>
          {player1?.username} vs {player2?.username}
        </div>
        <div className={styles.scoreDisplay}>
          {scores[0]} - {scores[1]}
        </div>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.playerControls}>
          <div className={styles.playerName}>{player1?.username}</div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.addPointButton}
              onClick={() => send("addPlayer1Point")}
            >
              Add Point
            </button>
            <button
              className={styles.subtractPointButton}
              onClick={() => send("subtractPlayer1Point")}
            >
              Remove Point
            </button>
          </div>
        </div>

        <div className={styles.playerControls}>
          <div className={styles.playerName}>{player2?.username}</div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.addPointButton}
              onClick={() => send("addPlayer2Point")}
            >
              Add Point
            </button>
            <button
              className={styles.subtractPointButton}
              onClick={() => send("subtractPlayer2Point")}
            >
              Remove Point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
