import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <div className={styles.navBar}>
      <Link href="/">A</Link>
      <Link href="/">B</Link>
    </div>
  );
}
