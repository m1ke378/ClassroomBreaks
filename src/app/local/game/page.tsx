"use client";

import { useState } from "react";
import Board from "@/components/Board/Board";
import { handlePlay } from "@/utils/functions";
import { Player, Players } from "@/utils/types";
import styles from "./local.module.css";
import { useSearchParams } from "next/navigation";
import { u } from "motion/react-client";
import TopBar from "@/components/TopBar/TopBar";

export default function LocalGame() {
  const comboArray: string[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      comboArray.push(`${i}${j}`);
    }
  }

  // State Variables
  const [board, setBoard] = useState(
    Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() =>
            Array(3)
              .fill(null)
              .map(() => Array(3).fill(""))
          )
      )
  );

  const [winnersBoard, setWinnersBoard] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(""))
  );

  const [activeCells, setActiveCells] = useState<string[]>(comboArray);
  const [finishedCells, setFinishedCells] = useState<string[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const searchParams = useSearchParams();

  const players: Players = {
    player1: { name: searchParams.get("player1") || "Player 1", symbol: "X" },
    player2: { name: searchParams.get("player2") || "Player 2", symbol: "O" },
  };

  console.log(players);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players.player1);

  // Handle a move
  const handlePlayMove = ({
    bigRowIndex,
    bigCellIndex,
    smallRowIndex,
    smallCellIndex,
  }: {
    bigRowIndex: number;
    bigCellIndex: number;
    smallRowIndex: number;
    smallCellIndex: number;
  }) => {
    const updatedState = handlePlay(
      {
        board,
        activeCells,
        finishedCells,
        winnersBoard,
        currentPlayer,
        players,
        comboArray,
        winner,
      },
      { bigRowIndex, bigCellIndex, smallRowIndex, smallCellIndex }
    );

    setBoard(updatedState.board);
    setActiveCells(updatedState.activeCells);
    setFinishedCells(updatedState.finishedCells);
    setWinnersBoard(updatedState.winnersBoard);
    setWinner(updatedState.winner);
    setCurrentPlayer(updatedState.currentPlayer);
  };

  function restartGame() {
    // Reset state for a new game
    setBoard(Array(3).fill(Array(3).fill(Array(3).fill(Array(3).fill("")))));
    setWinnersBoard(Array(3).fill(Array(3).fill("")));
    setWinner(null);
    setActiveCells(comboArray);
    setFinishedCells([]);
    setCurrentPlayer(players.player1);
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar currentPlayer={currentPlayer} players={players} />
      <Board
        gameState={{
          board,
          handlePlay: handlePlayMove,
          currentPlayer,
          players,
          winnersBoard,
          activeCells,
          finishedCells,
          winner,
          restartGame,
        }}
      />
    </div>
  );
}
