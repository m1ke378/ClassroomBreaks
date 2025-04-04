import styles from "./page.module.css";
import Link from "next/link";

import GameCard from "@/components/GameCard/GameCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.gameCardsContainer}>
        <Link href="/ultimate-tic-tac-toe" className={styles.gameCardLink}>
          <GameCard
            title="UltimateTicTacToe"
            imgSrc="/images/ultimate_tic_tac_toe.png"
            imgAlt="UltimateTicTacToe game image"
          />
        </Link>
        <Link href="/ultimate-tic-tac-toe" className={styles.gameCardLink}>
          <GameCard title="SOS (In progress)" imgAlt="SOS game image" />
        </Link>
      </div>
    </div>
  );
}
