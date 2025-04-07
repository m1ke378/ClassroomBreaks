import styles from "./page.module.css";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faPeopleArrows,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.gameSelectorsContainer}>
        <Link
          href="/ultimate-tic-tac-toe/local/create"
          className={styles.gameSelectorLink}
        >
          <FontAwesomeIcon icon={faUserGroup} />
          <span>Play Locally</span>
        </Link>
        <Link
          href="/ultimate-tic-tac-toe/online/private/create"
          className={styles.gameSelectorLink}
        >
          <FontAwesomeIcon icon={faPeopleArrows} />
          <span>Play With a Friend</span>
        </Link>
        <Link
          href="/ultimate-tic-tac-toe/online/public/create"
          className={styles.gameSelectorLink}
        >
          <FontAwesomeIcon icon={faGlobe} />
          <span>Play Online</span>
        </Link>
      </div>
    </div>
  );
}
