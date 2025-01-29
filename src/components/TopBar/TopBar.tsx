import { Player, Players } from "@/utils/types";
import styles from "./TopBar.module.css";
import { motion } from "motion/react";

export default function TopBar({
  currentPlayer,
  players,
}: {
  currentPlayer: Player | null;
  players: Players | null;
}) {
  return (
    <div className={styles.topBar}>
      {currentPlayer && players && (
        <>
          <div
            className={`${styles.player} ${
              currentPlayer.symbol === players.player1.symbol
                ? styles.active
                : ""
            }`}
            style={{
              boxShadow:
                currentPlayer.symbol === players.player1.symbol
                  ? "0 0 0 2px var(--x-symbol-color)"
                  : "",
            }}
          >
            {players.player1.name}
          </div>
          <motion.div
            className={styles.currentSymbol}
            style={{
              backgroundColor:
                currentPlayer.symbol === "X"
                  ? "var(--x-symbol-color)"
                  : "var(--o-symbol-color)",
            }}
            key={currentPlayer.symbol} // Re-mounts the element to trigger animations
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentPlayer.symbol}
          </motion.div>
          <div
            className={`${styles.player} ${
              currentPlayer.symbol === players.player2.symbol
                ? styles.active
                : ""
            }`}
            style={{
              boxShadow:
                currentPlayer.symbol === players.player2.symbol
                  ? "0 0 0 2px var(--o-symbol-color)"
                  : "",
            }}
          >
            {players.player2.name}
          </div>
        </>
      )}
    </div>
  );
}
