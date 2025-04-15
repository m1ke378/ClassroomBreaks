"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function CreateRoomClient({
  isPrivate,
}: {
  isPrivate: boolean;
}) {
  const [message, setMessage] = useState("");
  const playerNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function createRoom() {
    const playerName = playerNameRef.current?.value;
    const password = isPrivate ? passwordRef.current?.value : null;

    if (!playerName) {
      setMessage("Please enter your name.");
      return;
    }

    if (isPrivate && password) {
      sessionStorage.setItem("password", password);
      console.log("Saved pass:", password);
    }

    sessionStorage.setItem("playerName", playerName);

    console.log("Saved playerName:", playerName);

    fetch(`${API_URL}/create-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isPrivate: isPrivate ? "1" : "0",
        hostName: playerName,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.roomID) {
          router.push(
            `/ultimate-tic-tac-toe/online/${isPrivate ? "private" : "public"}/${
              data.roomID
            }`
          );
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setMessage("Error creating room."));
  }

  return (
    <div className={isPrivate ? "input-container" : "input-container-inline"}>
      <input
        ref={playerNameRef}
        placeholder="Name"
        autoComplete="off"
        type="text"
      />

      {isPrivate && (
        <input
          ref={passwordRef}
          placeholder="Password"
          type="password"
          autoComplete="off"
        />
      )}

      <button className="submit-button" onClick={createRoom}>
        Create
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
