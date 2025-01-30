"use client";

import styles from "./Board.module.css";

import { BoardProps, Cell } from "@/utils/types";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";

export default function Board({
  gameState,
  handlePlay,
  restartGame,
}: BoardProps) {
  const {
    board,
    currentPlayer,
    players,
    winnersBoard,
    activeCells,
    finishedCells,
    winner,
  } = gameState;

  const [mySocketId, setMySocketId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMySocketId(socket.id);
  }, []);

  const isMyTurn = mySocketId === currentPlayer?.id;

  const [isCheckingBoard, setIsCheckingBoard] = useState(false);

  return (
    <div className={styles.board}>
      {board.map((bigRow, bigRowIndex) =>
        bigRow.map((bigCell, bigCellIndex) => (
          <div
            key={`${bigRowIndex}${bigCellIndex}`}
            className={`${styles.bigCell}
              ${
                activeCells.includes(`${bigRowIndex}${bigCellIndex}`)
                  ? styles.active
                  : ""
              } ${
              finishedCells.includes(`${bigRowIndex}${bigCellIndex}`)
                ? styles.finished
                : ""
            }`}
            style={
              activeCells.includes(`${bigRowIndex}${bigCellIndex}`)
                ? {
                    boxShadow: `0 0 0 2px ${
                      currentPlayer.symbol === "X"
                        ? "var(--x-symbol-color)"
                        : "var(--o-symbol-color)"
                    }`,
                  }
                : {}
            }
          >
            <div className={styles.smallCellsContainer}>
              {bigCell.map((smallRow, smallRowIndex) =>
                smallRow.map((smallCell, smallCellIndex) => (
                  <div
                    key={`${bigRowIndex}${bigCellIndex}-${smallRowIndex}${smallCellIndex}`}
                    className={styles.smallCell}
                    onClick={() => {
                      if (isMyTurn && !smallCell && !isCheckingBoard) {
                        handlePlay({
                          bigRowIndex,
                          bigCellIndex,
                          smallRowIndex,
                          smallCellIndex,
                        } as Cell);
                      }
                    }}
                    style={{
                      color:
                        smallCell === players.player1.symbol
                          ? "var(--x-symbol-color)"
                          : "var(--o-symbol-color)",
                      cursor:
                        isMyTurn && !smallCell && !isCheckingBoard
                          ? "pointer"
                          : "initial",
                      opacity: isMyTurn ? "1" : "0.6",
                    }}
                  >
                    {smallCell}
                  </div>
                ))
              )}
            </div>
            {winnersBoard[bigRowIndex][bigCellIndex] && !isCheckingBoard && (
              <div
                className={styles.bigSymbol}
                style={{
                  color:
                    winnersBoard[bigRowIndex][bigCellIndex] ===
                    players.player1.symbol
                      ? "var(--x-symbol-color)"
                      : "var(--o-symbol-color)",
                }}
              >
                {winnersBoard[bigRowIndex][bigCellIndex]}
              </div>
            )}
          </div>
        ))
      )}
      {winner ? (
        isCheckingBoard ? (
          <div className={styles.checkingBoard}>
            <button
              onClick={() => {
                setIsCheckingBoard(false);
                restartGame();
              }}
              className={styles.submit}
            >
              Restart
            </button>
          </div>
        ) : (
          <div className={styles.winner}>
            <div>
              <span
                style={{
                  color:
                    winner.symbol === "X"
                      ? "var(--x-symbol-color-finished)"
                      : "var(--o-symbol-color-finished)",
                }}
              >
                {winner.name}
              </span>{" "}
              wins!
            </div>
            <div className={styles.buttonsContainer}>
              <button
                onClick={() => {
                  setIsCheckingBoard(false);
                  restartGame();
                }}
                className={styles.submit}
              >
                Restart
              </button>
              <button onClick={() => setIsCheckingBoard(true)}>
                Check Board
              </button>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}
