"use client";

import { useState } from "react";
import styles from "./NameModal.module.css";
import { useRouter } from "next/navigation";

export default function NameModal({
  handleJoinRoom,
  closeModal,
  requirePassword,
  passwordError,
}: {
  handleJoinRoom: (playerName: string, password?: string) => void;
  closeModal: () => void;
  requirePassword?: boolean;
  passwordError?: boolean;
}) {
  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Enter room</h3>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        {requirePassword && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={passwordError ? { boxShadow: "1px red" } : {}}
          />
        )}
        <div className={styles.modalActions}>
          <button
            onClick={() => {
              handleJoinRoom(
                playerName,
                requirePassword ? password : undefined
              );
              closeModal();
            }}
            disabled={!playerName.trim()}
            className={styles.submitButton}
          >
            Join Room
          </button>
          <button
            onClick={() => {
              setPlayerName("");
              setPassword("");
              closeModal();
              router.push(
                `/ultimate-tic-tac-toe/online/${
                  requirePassword ? "private" : "public"
                }/create`
              );
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
