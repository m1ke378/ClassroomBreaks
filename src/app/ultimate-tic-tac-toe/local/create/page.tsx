"use client";

import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateLocalGamePage() {
  const player1input = useRef<HTMLInputElement>(null);
  const player2input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleStartLocalGame = () => {
    const player1name = player1input.current ? player1input.current.value : "";
    const player2name = player2input.current ? player2input.current.value : "";
    if (!player1name && !player2name) {
      if (confirm("Play with default names?")) {
        router.push(
          `/ultimate-tic-tac-toe/local/game?player1=Player1&player2=Player2`
        );
      }
    } else {
      router.push(
        `/ultimate-tic-tac-toe/local/game?player1=${player1name}&player2=${player2name}`
      );
    }
  };

  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Insert the names</h3>
        <div className="input-container">
          <div className="input-container-local">
            <span className="symbol-label x-symbol">X</span>
            <input
              type="text"
              id="player1input"
              placeholder="John"
              ref={player1input}
            />
          </div>
          <div className="input-container-local">
            <span className="symbol-label o-symbol">O</span>
            <input
              type="text"
              id="player2input"
              placeholder="Kim"
              ref={player2input}
            />
          </div>
        </div>
      </BaseCard>
      <button className="submit-button" onClick={handleStartLocalGame}>
        Play
      </button>
    </div>
  );
}
