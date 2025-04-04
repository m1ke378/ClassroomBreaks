import Link from "next/link";
import styles from "./Nav.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  return (
    <nav className={styles.navBar}>
      <Link href="/">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link href="/">
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </nav>
  );
}
