"use client";
import { useMemo, useState } from "react";
import { editTournament } from "@/actions/tournamentActions";
import styles from "./edit.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Tournament</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          editTournament(id, newName, newSize);
        }}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>Tournament Name</label>
          <input
            className={styles.input}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter tournament name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tournament Size</label>
          <select
            className={styles.select}
            value={newSize}
            onChange={(e) => setNewSize(Number(e.target.value))}
          >
            {sizeOptions.map((o) => (
              <option key={o} value={o}>
                {o} participants
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!newName.trim()}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
