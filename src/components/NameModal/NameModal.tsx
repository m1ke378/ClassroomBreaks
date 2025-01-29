"use client";

import { useState } from "react";
import styles from "./NameModal.module.css";

export default function NameModal({
  handleJoinRoom,
  closeModal,
}: {
  handleJoinRoom: (playerName: string) => void;
  closeModal: () => void;
}) {
  const [playerName, setPlayerName] = useState("");

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Enter your name</h3>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <div className={styles.modalActions}>
          <button
            onClick={() => handleJoinRoom(playerName)}
            disabled={!playerName.trim()}
            className={styles.submitButton}
          >
            Join Room
          </button>
          <button
            onClick={() => {
              setPlayerName("");
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
