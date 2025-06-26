"use client";

import { createTournament } from "@/actions/tournamentActions";
import { useMemo, useState } from "react";

export default function Create() {
  const [selectedSize, setSelectedSize] = useState(2);
  const [selectedName, setSelectedName] = useState("");

  const sizeOptions = useMemo(() => {
    let sizeOptionsArray = [];
    for (let i = 1; i < 13; i++) {
      sizeOptionsArray.push(2 ** i);
    }
    return sizeOptionsArray;
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTournament(selectedSize, selectedName);
        }}
      >
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(Number(e.target.value))}
        >
          {sizeOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <input
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
