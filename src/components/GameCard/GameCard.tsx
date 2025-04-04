import styles from "./GameCard.module.css";
export default function BaseCard({
  title,
  imgSrc,
  imgAlt,
}: {
  title: string;
  imgSrc?: string;
  imgAlt: string;
}) {
  return (
    <div className={styles.gameCard}>
      {imgSrc ? (
        <img src={imgSrc} alt={imgAlt} />
      ) : (
        <div className={styles.imgFiller}></div>
      )}
      <h3>{title}</h3>
    </div>
  );
}
