"use client";

import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function CreateOnlinePrivateGamePage() {
  const [message, setMessage] = useState("");
  const playerNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function createPrivateRoom() {
    if (!playerNameRef.current || !playerNameRef.current.value) {
      setMessage("Please enter a name.");
      return;
    }

    let password = "";

    if (!passwordRef.current || !passwordRef.current.value) {
      if (
        !confirm("Creating a room without password. Do you wish to continue?")
      ) {
        return;
      }
    } else {
      password = passwordRef.current.value;
    }

    let playerName = playerNameRef.current.value;

    fetch(`${API_URL}/create-private-room`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        isPrivate: true,
        password: password,
        hostName: playerName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.roomId)
          router.push(
            `/ultimate-tic-tac-toe/online/${data.roomId}?player-name=${playerName}`
          );
      })
      .catch((error) => {
        setMessage("Failed to create room.");
        console.error(error);
      });
  }

  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Create a room</h3>
        <div className="input-container">
          <label htmlFor="player1input">Name</label>
          <input
            type="text"
            id="player1input"
            placeholder="John"
            ref={playerNameRef}
          />
        </div>
        <div className="input-container">
          <label htmlFor="roomPasswordInput">Password</label>
          <input
            type="password"
            id="roomPasswordInput"
            placeholder=""
            ref={passwordRef}
          />
        </div>
      </BaseCard>
      <button className="submit-button" onClick={createPrivateRoom}>
        Create
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
