import styles from "./BaseCard.module.css";
export default function BaseCard({ children }: { children: React.ReactNode }) {
  return <div className={styles.baseCard}>{children}</div>;
}
