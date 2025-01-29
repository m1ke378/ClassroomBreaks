"use client"; // Mark this component as a client component

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function CreateRoomClient() {
  const [message, setMessage] = useState("");
  const playerNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function createPublicRoom() {
    if (!playerNameRef.current || !playerNameRef.current.value) {
      setMessage("Please enter a name.");
      return;
    }

    let playerName = playerNameRef.current.value;

    fetch(`${API_URL}/create-room`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        isPrivate: false,
        password: null,
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
    <div className="input-container">
      <label htmlFor="player1input">Name</label>
      <div className="input-button-wrapper">
        <input
          type="text"
          id="player1input"
          placeholder="John"
          ref={playerNameRef}
        />
        <button className="submit-button" onClick={createPublicRoom}>
          Create
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
