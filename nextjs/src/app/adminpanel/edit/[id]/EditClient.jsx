"use client";
import { useMemo, useState } from "react";
import { editTournament } from "@/actions/tournamentActions";

export default function EditClient({ name, size, users, id }) {
  const [newName, setNewName] = useState(name);
  const [newSize, setNewSize] = useState(size);

  const sizeOptions = useMemo(() => {
    let sizeOptionsArray = [];
    for (let i = 1; i < 13; i++) {
      sizeOptionsArray.push(2 ** i);
    }
    return sizeOptionsArray;
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editTournament(id, newName, newSize);
        }}
      >
        <select
          value={newSize}
          onChange={(e) => setNewSize(Number(e.target.value))}
        >
          {sizeOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        ></input>
        <button type="submit">Edit</button>
      </form>
    </>
  );
}
