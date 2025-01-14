"use client";

import Board from "@/components/Board/Board";
import { useState } from "react";

export default function LocalGame() {
  const comboArray: string[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      comboArray.push(`${i}${j}`);
    }
  }

  const [board, setBoard] = useState(
    Array(3).fill(Array(3).fill(Array(3).fill(Array(3).fill(""))))
  );
  console.log(board);
  const [winnersBoard, setWinnersBoard] = useState(
    Array(3).fill(Array(3).fill(""))
  );
  const [activeCells, setActiveCells] = useState<string[]>(comboArray);
  const [finishedCells, setFinishedCells] = useState<string[]>([]);

  return (
    <div>
      <h1>Local Game</h1>
      <Board
        gameState={{
          board,
          handlePlay: () => {},
          players: {
            player1: { name: "Player 1", symbol: "X" },
            player2: { name: "Player 2", symbol: "O" },
          },
          winnersBoard,
          activeCells,
          finishedCells,
          winner: null,
          restartGame: () => {},
        }}
      />
    </div>
  );
}
