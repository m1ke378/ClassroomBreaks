import { useState } from "react";
import styles from "./Board.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { BoardProps, Cell } from "@/utils/types"; // Ensure these types are correctly imported

export default function Board({ gameState }: { gameState: BoardProps }) {
  const [isCheckingBoard, setIsCheckingBoard] = useState(false);
  const {
    board,
    handlePlay,
    players,
    winnersBoard,
    activeCells,
    finishedCells,
    winner,
    restartGame,
  } = gameState;

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
          >
            <div className={styles.smallCellsContainer}>
              {bigCell.map((smallRow, smallRowIndex) =>
                smallRow.map((smallCell, smallCellIndex) => {
                  return (
                    <div
                      key={`${bigRowIndex}${bigCellIndex}-${smallRowIndex}${smallCellIndex}`}
                      className={styles.smallCell}
                      onClick={() => {
                        if (
                          winner ||
                          !activeCells.includes(
                            `${bigRowIndex}${bigCellIndex}`
                          ) ||
                          finishedCells.includes(
                            `${bigRowIndex}${bigCellIndex}`
                          ) ||
                          smallCell !== ""
                        ) {
                          return;
                        }
                        handlePlay({
                          bigRowIndex,
                          bigCellIndex,
                          smallRowIndex,
                          smallCellIndex,
                        } as Cell); // Ensure type matching
                      }}
                      style={{
                        color:
                          smallCell === players.player1.symbol
                            ? "var(--primary-color-symbol)"
                            : "var(--secondary-color-symbol)",
                      }}
                    >
                      {smallCell}
                    </div>
                  );
                })
              )}
            </div>
            {winnersBoard[bigRowIndex][bigCellIndex] && !isCheckingBoard && (
              <div
                className={styles.bigSymbol}
                style={{
                  color:
                    winnersBoard[bigRowIndex][bigCellIndex] ===
                    players.player1.symbol
                      ? "var(--primary-color-symbol-finished)"
                      : "var(--secondary-color-symbol-finished)",
                }}
              >
                {winnersBoard[bigRowIndex][bigCellIndex]}
              </div>
            )}
          </div>
        ))
      )}
      {winner && !isCheckingBoard && (
        <div className={styles.winner}>
          <div>
            <span
              style={{
                color:
                  winner.symbol === "X"
                    ? "var(--primary-color-symbol-finished)"
                    : "var(--secondary-color-symbol-finished)",
              }}
            >
              {winner.name}
            </span>{" "}
            wins!
          </div>
          <div className={styles.buttonsContainer}>
            <button onClick={restartGame}>Restart</button>
            <button
              onClick={() => {
                setIsCheckingBoard(true);
              }}
            >
              Check Board
            </button>
          </div>
        </div>
      )}
      {isCheckingBoard && (
        <button
          className={styles.restartOverlayButton}
          onClick={() => {
            setIsCheckingBoard(false);
            restartGame();
          }}
        >
          Restart
          <span>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </span>
        </button>
      )}
    </div>
  );
}
