"use client";

import { createTournament } from "@/actions/tournamentActions";
import { useMemo, useState } from "react";
import styles from "./create.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Create Tournament</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          createTournament(selectedName, selectedSize);
        }}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>Tournament Name</label>
          <input
            className={styles.input}
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            placeholder="Enter tournament name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tournament Size</label>
          <select
            className={styles.select}
            value={selectedSize}
            onChange={(e) => setSelectedSize(Number(e.target.value))}
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
          disabled={!selectedName.trim()}
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
}
